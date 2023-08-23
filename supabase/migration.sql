create table
  public.statistics (
    id uuid not null default uuid_generate_v4 (),
    spoke_sentence integer not null,
    shared_sentence integer not null,
    copied_sentence integer not null,
    uwuified_sentence integer not null,
    constraint statistics_pkey primary key (id)
  ) tablespace pg_default;

create policy "Public can select specific row" on public.statistics
  for select using (id = '4e2e6f56-b4dc-4a38-9bf7-5d3c59321890');
