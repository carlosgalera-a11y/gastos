# Gastos · Piso Horta

Webapp compartida de Carlos + Montse para el piso de Horta (Barcelona):
facturas de **luz / comida / otros** y **estrategias de ahorro**.

- Una sola página (`index.html`), sin build: GitHub Pages la sirve tal cual.
- Conectada al Supabase de **FileHub** (mismos datos que el apartado
  «Piso Horta» de la app): tabla `files` + bucket privado `archivo`
  (prefijo `piso-horta/`) y tabla `piso_horta_estrategias`.
- La privacidad la garantizan las políticas RLS del servidor (solo los dos
  emails de la pareja); la clave que aparece en el código es la anónima
  pública de Supabase, pensada para estar en el cliente.
- Mismo origen que el espejo de FileHub (`carlosgalera-a11y.github.io`),
  así que la sesión se comparte sola entre las apps.

**URL**: https://carlosgalera-a11y.github.io/gastos/
