# Duraciones de tratamiento — referencia para la agenda

La clínica no tenía tiempos medidos. Estas duraciones se tomaron de tiempos
publicados por med spas y fabricantes, y son **valores de referencia para
arrancar**, no números de Alpha Aesthetics. Un profesional de la clínica debe
revisarlos antes de abrir la agenda al público.

Cada duración es **tiempo total de silla**, no solo el procedimiento. Esa
distinción es la que evita que la sala se trabe: Virtue RF y PDO necesitan
30–45 minutos de anestesia tópica antes de que empiece nada.

Fuente de verdad: [`js/booking-config.js`](js/booking-config.js). Si cambias un
número acá, cámbialo también allá **y** en el event type de Cal.com.

## Ya declarados por la clínica

Estos cuatro venían con la duración en el nombre del producto, así que no se
investigaron — se respetaron:

| Tratamiento | Min |
|---|---|
| Teen Facial | 30 |
| Signature Alpha Facial | 45 |
| Sports Facial | 60 |
| Red Light Therapy (sesión) | 20 |

## Investigados

| Tipo de visita | Min | Procedimiento | Por qué el bloque es más largo |
|---|---|---|---|
| Botox / Dysport | 30 | 10–20 min | Se agenda 30–60 min contando la valoración |
| Rellenos Restylane | 45 | 15–30 min | Varía según zonas; margen para valoración |
| PDO Smooth Lift (una zona) | 60 | 20–30 min | Anestesia tópica y preparación |
| PDO Thread Lift completo | 90 | 30–60 min | Más hilos y más zonas, más anestesia |
| Virtue RF rostro | 90 | 45–60 min | **45 min de anestesia tópica antes** |
| Virtue RF rostro + cuello (+ pecho) | 120 | 45–60 min | Más superficie, misma anestesia previa |
| Virtue RF zona pequeña (submentón, cicatrices) | 75 | ~45 min | Anestesia tópica |
| Virtue RF zona mediana (brazos, estrías) | 105 | 45–60 min | Anestesia tópica |
| Virtue RF zona grande (abdomen, muslos, glúteos) | 120 | 60 min | Anestesia tópica sobre área extensa |
| PHYSIQ (una sesión) | 30 | 30 min | Sin preparación, tiempo del fabricante |
| VI Peel | 30 | ~15 min | Se agenda 30 min; el paciente sale con el peel puesto |
| VI Peel Body área grande | 45 | ~15 min | Más superficie de aplicación |
| Terapia IV | 60 | 45–60 min | Rango típico 30–60; las fórmulas altas llegan a 90 |
| Inserción de pellets (EvexiPEL) | 30 | 15–20 min | Preparación y campo estéril |
| Extracción de laboratorio | 15 | — | Solo toma de muestra |
| Inyección (testosterona, sermorelina) | 15 | — | Aplicación y observación breve |
| Consulta inicial | 45 | — | Historia clínica y plan de tratamiento |
| Visita de seguimiento de peso | 20 | — | Revisión de dosis y aplicación |
| Sesión educativa de péptidos | 60 | — | Formato de charla, ya se vende como sesión |

## Los que más conviene verificar primero

Estos tres son los que más caro cuestan si están mal, porque bloquean equipo y
sala por bloques largos:

1. **Virtue RF** — todo el modelo asume 45 min de anestesia. Si la clínica
   aplica la crema en otra sala mientras atiende a alguien más, los bloques
   bajan de 90–120 a 45–60 min y les cabe casi el doble de pacientes al día.
2. **PDO Thread Lift completo** — 90 min es el extremo alto del rango publicado.
3. **Terapia IV** — 60 min asume que el paciente ocupa la silla todo el goteo.

## Detalles que la agenda ya contempla

- **Paquetes** (PHYSIQ 5 sesiones, Red Light 5 y 10): el precio cubre N
  sesiones, pero se agenda una por vez. Solo se reserva el tiempo de una.
- **Add-ons** (Glutathione, Amino Blend): no se agendan solos, se suman a una
  visita de IV.
- **Retail** (28 productos: cremas, suplementos, sueros): no se agenda, se
  compra por el carrito.

## Fuentes

- [Skin Deep Med Spa — How long does a Botox appointment take](https://www.skindeepmedspa.com/how-long-does-a-botox-appointment-usually-take/)
- [Dream Spa Medical — What to expect at your first Botox appointment](https://www.dreamspamedical.com/what-to-expect-at-your-first-botox-appointment/)
- [Harmony Medispa — Dermal fillers](https://www.myharmonymedispa.com/plump-smooth-and-sculpt)
- [Rothaus MD — Virtue RF microneedling](https://www.rothausmd.com/medical-spa-treatments-nyc/facials-skincare/virtue-rf/)
- [Rockmore Plastic Surgery — VirtueRF microneedling](https://www.rockmoreplasticsurgery.com/nonsurgical/virtuerf-microneedling/)
- [Contemporary Health Center — PhysiQ + Virtue RF](https://contemporaryhealthcenter.com/medical-weight-loss/body-sculpting/bodyright-combination-physiq-and-virtue-deep-rf-microneedling-treatments/)
- [Athena Plastic Surgery — PDO thread lift](https://athenaplasticsurgery.com/pdo-thread-lift/)
- [Healthline — PDO thread lift](https://www.healthline.com/health/beauty-skin-care/pdo-thread-lift)
- [CAS MediSpa — How long does a VI chemical peel take](https://casmedispa.com/blog/how-long-does-a-vi-chemical-peel-take/)
- [Ever/Body — VI Peel](https://everbody.com/treatment/vi-peel/)
- [PURE — How long does IV therapy last](https://purelafayette.com/blog/how-long-does-iv-therapy-last/)
- [WellSpot IV — IV drip duration explained](https://www.wellspotiv.com/blog/iv-drip-duration-explained-how-long-does-iv-therapy-take)
- [EvexiPEL — What to expect with hormone replacement therapy](https://www.evexipel.com/what-to-expect-with-hormone-replacement-therapy/)
- [SGK Plastic Surgery — EvexiPEL pellet therapy](https://drkimplasticsurgery.com/non-surgical/evexipel-pellet-therapy/)
