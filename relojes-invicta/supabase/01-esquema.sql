-- ═══════════════════════════════════════════════════════════════
--  AURUM TEMPO · Esquema Supabase (PostgreSQL)
--  Ejecuta este archivo completo en: Supabase → SQL Editor → New query
--  Después ejecuta 02-semilla.sql (productos y cupones).
-- ═══════════════════════════════════════════════════════════════

create extension if not exists pgcrypto;

-- ── Ajustes generales (campaña Black Friday, adelanto) ──
create table if not exists ajustes (
  clave text primary key,
  valor jsonb not null
);
insert into ajustes (clave, valor) values
  ('black_friday', '{"inicio":"2026-11-26T00:00:00-05:00","fin":"2026-11-30T23:59:59-05:00"}'),
  ('adelanto', '20')
on conflict (clave) do nothing;

-- ── Productos ──
create table if not exists productos (
  id text primary key,
  nombre text not null,
  linea text not null,
  categoria text not null check (categoria in ('deportivo', 'formal')),
  movimiento text not null,
  ref text default '',
  precio numeric(10,2) not null check (precio > 0),
  bf int not null default 0 check (bf between 0 and 90),
  stock int not null default 5,
  etiquetas text[] not null default '{}',
  outfits text[] not null default '{}',
  descripcion text default '',
  imagen text default '',
  imagenes text[] not null default '{}',
  specs jsonb,
  visual jsonb,
  activo boolean not null default true,
  orden int not null default 0,
  actualizado timestamptz not null default now()
);

-- ── Cupones ──
create table if not exists cupones (
  codigo text primary key,
  porcentaje int not null check (porcentaje between 1 and 90),
  minimo numeric(10,2) not null default 0,
  descripcion text default '',
  activo boolean not null default true,
  usos int not null default 0,
  max_usos int,
  vence timestamptz,
  creado timestamptz not null default now()
);

-- ── Clientes (CRM) ──
create table if not exists clientes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  telefono text not null unique,
  dni text,
  email text,
  departamento text,
  provincia text,
  distrito text,
  acepta_marketing boolean default true,
  etiquetas text[] not null default '{}',
  notas text default '',
  creado timestamptz not null default now(),
  actualizado timestamptz not null default now()
);

-- ── Pedidos ──
create sequence if not exists pedidos_numero start 1001;
create table if not exists pedidos (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique default ('AT-' || nextval('pedidos_numero')),
  cliente_id uuid references clientes(id) on delete set null,
  items jsonb not null,
  cupon text,
  regular numeric(10,2) not null,
  descuento_bf numeric(10,2) not null default 0,
  subtotal numeric(10,2) not null,
  descuento_cupon numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  adelanto numeric(10,2) not null,
  saldo numeric(10,2) not null,
  entrega jsonb,
  notas text default '',
  estado text not null default 'nuevo'
    check (estado in ('nuevo', 'separado', 'enviado', 'en_agencia', 'entregado', 'cancelado')),
  creado timestamptz not null default now(),
  actualizado timestamptz not null default now()
);
create index if not exists pedidos_creado_idx on pedidos (creado desc);
create index if not exists pedidos_cliente_idx on pedidos (cliente_id);

-- ── Administradores (usuarios de Supabase Auth con acceso al panel) ──
create table if not exists admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  creado timestamptz not null default now()
);

create or replace function es_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$;

-- ── Vista CRM: clientes con métricas ──
create or replace view vista_clientes with (security_invoker = true) as
select c.*,
  count(p.id) filter (where p.estado <> 'cancelado') as pedidos,
  coalesce(sum(p.total) filter (where p.estado <> 'cancelado'), 0) as total_comprado,
  max(p.creado) as ultimo_pedido
from clientes c
left join pedidos p on p.cliente_id = c.id
group by c.id;

-- ═══════════════ Seguridad (RLS) ═══════════════
alter table ajustes enable row level security;
alter table productos enable row level security;
alter table cupones enable row level security;
alter table clientes enable row level security;
alter table pedidos enable row level security;
alter table admins enable row level security;

drop policy if exists "productos visibles" on productos;
create policy "productos visibles" on productos for select using (activo or es_admin());
drop policy if exists "productos admin" on productos;
create policy "productos admin" on productos for all using (es_admin()) with check (es_admin());

drop policy if exists "ajustes lectura" on ajustes;
create policy "ajustes lectura" on ajustes for select using (true);
drop policy if exists "ajustes admin" on ajustes;
create policy "ajustes admin" on ajustes for all using (es_admin()) with check (es_admin());

drop policy if exists "cupones admin" on cupones;
create policy "cupones admin" on cupones for all using (es_admin()) with check (es_admin());
drop policy if exists "clientes admin" on clientes;
create policy "clientes admin" on clientes for all using (es_admin()) with check (es_admin());
drop policy if exists "pedidos admin" on pedidos;
create policy "pedidos admin" on pedidos for all using (es_admin()) with check (es_admin());
drop policy if exists "admins lectura propia" on admins;
create policy "admins lectura propia" on admins for select using (user_id = auth.uid());

-- ═══════════════ Funciones públicas (RPC) ═══════════════

-- ¿Está activo el Black Friday?
create or replace function bf_activo() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(
    (select now() between (valor->>'inicio')::timestamptz and (valor->>'fin')::timestamptz
       from ajustes where clave = 'black_friday'), false);
$$;

-- Validar cupón contra un subtotal
create or replace function validar_cupon(p_codigo text, p_subtotal numeric)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare c cupones;
begin
  select * into c from cupones where codigo = upper(trim(p_codigo));
  if not found or not c.activo or (c.vence is not null and c.vence < now())
     or (c.max_usos is not null and c.usos >= c.max_usos) then
    return jsonb_build_object('valido', false, 'mensaje', 'Este cupón no existe o ya no está vigente.');
  end if;
  if p_subtotal < c.minimo then
    return jsonb_build_object('valido', false,
      'mensaje', format('Este cupón aplica desde S/ %s. Te faltan S/ %s.', c.minimo, c.minimo - p_subtotal));
  end if;
  return jsonb_build_object('valido', true, 'codigo', c.codigo, 'porcentaje', c.porcentaje, 'minimo', c.minimo,
    'mensaje', format('¡Listo! %s%% extra aplicado.', c.porcentaje));
end $$;

-- Crear pedido: recalcula precios en el servidor (no confía en el navegador)
create or replace function crear_pedido(p_cliente jsonb, p_items jsonb, p_cupon text, p_entrega jsonb, p_notas text)
returns jsonb language plpgsql volatile security definer set search_path = public as $$
declare
  v_tel text := regexp_replace(coalesce(p_cliente->>'telefono', ''), '\D', '', 'g');
  v_cliente uuid;
  v_bf boolean := bf_activo();
  v_regular numeric := 0;
  v_subtotal numeric := 0;
  v_desc_cupon numeric := 0;
  v_total numeric;
  v_adelanto numeric := coalesce((select (valor #>> '{}')::numeric from ajustes where clave = 'adelanto'), 20);
  v_items jsonb := '[]'::jsonb;
  v_cupon cupones;
  it jsonb;
  pr productos;
  v_cant int;
  v_unit numeric;
  v_pedido pedidos;
begin
  if length(v_tel) < 9 or length(coalesce(p_cliente->>'nombre', '')) < 3 then
    raise exception 'Datos del cliente incompletos';
  end if;
  if jsonb_array_length(coalesce(p_items, '[]')) = 0 or jsonb_array_length(p_items) > 20 then
    raise exception 'Pedido vacío o demasiado grande';
  end if;

  for it in select * from jsonb_array_elements(p_items) loop
    select * into pr from productos where id = it->>'id' and activo;
    if not found then raise exception 'Producto no disponible: %', it->>'id'; end if;
    v_cant := greatest(1, least(5, coalesce((it->>'cantidad')::int, 1)));
    v_unit := case when v_bf and pr.bf > 0 then round(pr.precio * (1 - pr.bf / 100.0)) else pr.precio end;
    v_regular := v_regular + pr.precio * v_cant;
    v_subtotal := v_subtotal + v_unit * v_cant;
    v_items := v_items || jsonb_build_object('id', pr.id, 'nombre', pr.nombre, 'linea', pr.linea, 'cantidad', v_cant, 'precio_unit', v_unit);
  end loop;

  if p_cupon is not null and p_cupon <> '' then
    select * into v_cupon from cupones where codigo = upper(trim(p_cupon)) and activo
      and (vence is null or vence > now()) and (max_usos is null or usos < max_usos);
    if found and v_subtotal >= v_cupon.minimo then
      v_desc_cupon := round(v_subtotal * v_cupon.porcentaje / 100.0);
      update cupones set usos = usos + 1 where codigo = v_cupon.codigo;
    else
      v_cupon := null;
    end if;
  end if;

  v_total := greatest(0, v_subtotal - v_desc_cupon);
  v_adelanto := least(v_adelanto, v_total);

  insert into clientes (nombre, telefono, dni, email, departamento, provincia, distrito, acepta_marketing)
  values (p_cliente->>'nombre', v_tel, p_cliente->>'dni', nullif(p_cliente->>'email', ''), p_cliente->>'departamento',
          p_cliente->>'provincia', p_cliente->>'distrito', coalesce((p_cliente->>'acepta_marketing')::boolean, true))
  on conflict (telefono) do update set
    nombre = excluded.nombre, dni = coalesce(excluded.dni, clientes.dni), email = coalesce(excluded.email, clientes.email),
    departamento = excluded.departamento, provincia = excluded.provincia, distrito = excluded.distrito,
    acepta_marketing = excluded.acepta_marketing, actualizado = now()
  returning id into v_cliente;

  insert into pedidos (cliente_id, items, cupon, regular, descuento_bf, subtotal, descuento_cupon, total, adelanto, saldo, entrega, notas)
  values (v_cliente, v_items, v_cupon.codigo, v_regular, v_regular - v_subtotal, v_subtotal, v_desc_cupon, v_total,
          v_adelanto, v_total - v_adelanto, p_entrega, left(coalesce(p_notas, ''), 500))
  returning * into v_pedido;

  return jsonb_build_object('codigo', v_pedido.codigo, 'items', v_items, 'cupon', v_pedido.cupon,
    'regular', v_regular, 'descuento_bf', v_pedido.descuento_bf, 'subtotal', v_subtotal, 'descuento_cupon', v_desc_cupon,
    'total', v_total, 'adelanto', v_adelanto, 'saldo', v_pedido.saldo, 'entrega', p_entrega, 'notas', v_pedido.notas);
end $$;

revoke all on function crear_pedido(jsonb, jsonb, text, jsonb, text) from public;
grant execute on function crear_pedido(jsonb, jsonb, text, jsonb, text) to anon, authenticated;
grant execute on function validar_cupon(text, numeric) to anon, authenticated;
grant execute on function bf_activo() to anon, authenticated;
grant execute on function es_admin() to anon, authenticated;

-- Mantener "actualizado"
create or replace function tocar_actualizado() returns trigger language plpgsql as $$
begin new.actualizado := now(); return new; end $$;
drop trigger if exists t_pedidos_act on pedidos;
create trigger t_pedidos_act before update on pedidos for each row execute function tocar_actualizado();
drop trigger if exists t_productos_act on productos;
create trigger t_productos_act before update on productos for each row execute function tocar_actualizado();
