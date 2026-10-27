-- Nova Resell 1.24.1 : l'administrateur peut voir les captures d'écran jointes aux messages des testeurs (dossier _feedback seulement)
drop policy if exists "captures admin lecture" on storage.objects;
create policy "captures admin lecture" on storage.objects for select to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[2] = '_feedback' and lower(auth.jwt() ->> 'email') = 'chantepie.000@gmail.com');
