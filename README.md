🧠 Realtime Collaborative Board (Vue 3 + Socket.IO)

Aplicación web colaborativa en tiempo real que permite a múltiples usuarios crear, editar, mover y comentar notas simultáneamente sobre un tablero compartido.

El foco del proyecto está en arquitectura frontend, sincronización en tiempo real, manejo de concurrencia y experiencia de usuario, utilizando Vue 3 y Socket.IO.

🚀 Tecnologías utilizadas
Frontend

Vue 3 (Composition API)

Vite

TypeScript

Pinia (state management)

Tailwind CSS

Socket.IO Client

Backend

Node.js

Express

Socket.IO

Estado en memoria (sin base de datos, según lo indicado en el reto)

Testing

Vitest

@vue/test-utils

happy-dom

📂 Estructura del proyecto
Finmarkets/
├── backend/
│   ├── server.js
│   └── src/
│       ├── socketHandlers.js
│       ├── data.js
│       └── utils.js
│
└── finmarkets-drag-drop/
    ├── src/
    │   ├── components/
    │   │   ├── board/
    │   │   │   ├── Board.vue
    │   │   │   └── NoteCard.vue
    │   │   └── ui/
    │   │       └── UserPresence.vue
    │   ├── stores/
    │   │   ├── notes.store.ts
    │   │   ├── users.store.ts
    │   │   └── ui.store.ts
    │   ├── services/
    │   │   └── socket/
    │   │       └── socket.service.ts
    │   └── tests/
    │       ├── components/
    │       └── stores/
    └── vite.config.ts

🧩 Arquitectura y responsabilidades
Componentes

App.vue: bootstrap de la aplicación, join de usuario y layout general.

Board.vue: renderiza el tablero y lista de notas.

NoteCard.vue: componente dueño de la nota (edición, drag & drop, comentarios).

UserPresence.vue: muestra usuarios conectados en tiempo real.

Stores (Pinia)

notes.store: estado de las notas y sincronización realtime.

users.store: gestión de usuarios conectados.

ui.store: estado UI (errores, indicadores de edición).

Services

socket.service: capa única de comunicación con Socket.IO (emisión de eventos).

👉 Los componentes no acceden directamente al socket, solo a través de services/stores.

🔌 Eventos Socket.IO
Cliente → Servidor

user:join

board:init

note:create

note:update

note:delete

note:comment

note:editing:start

note:editing:stop

Servidor → Cliente

presence:users

board:data

note:created

note:updated

note:deleted

note:commented

note:editing

note:editing:stop

🔄 Manejo de concurrencia
Estrategia de resolución

Se utiliza Last Write Wins mediante timestamps:

Cada actualización incluye timestamp.

El frontend aplica la actualización solo si es más reciente.

Garantiza convergencia del estado sin necesidad de CRDT.

Indicador visual de edición

Cuando un usuario edita una nota:

Se emiten eventos note:editing:start / stop.

Los demás usuarios ven el mensaje:

“Carlos está editando esta nota…”

Se aplica un delay de 2 segundos al limpiar el estado para mejorar la percepción visual y evitar parpadeos.

🧪 Testing

Se implementaron tests mínimos, tal como solicita el reto:

2 tests de componentes

Board.vue

NoteCard.vue

1 test de lógica

notes.store (estrategia last-write-wins)

Los tests validan:

Renderizado

Interacciones del usuario

Integración con services (usando spyOn sobre singletons)

Ejecutar tests:

npx vitest

▶️ Cómo ejecutar el proyecto
Backend
cd backend
npm install
npm run dev


Servidor disponible en:

http://localhost:3001

Frontend
cd finmarkets-drag-drop
npm install
npm run dev


Aplicación disponible en:

http://localhost:5173

💡 Decisiones técnicas destacadas

Separación clara entre UI, estado y comunicación realtime.

Uso de services singleton para sockets, evitando lógica distribuida.

Concurrencia manejada sin sobreingeniería (sin CRDT).

Tests enfocados en comportamiento, no en implementación.

UX cuidada para entornos colaborativos.

📌 Consideraciones finales

Este proyecto prioriza:

Claridad arquitectónica

Correcto manejo de estado compartido

Escalabilidad del frontend

Código defendible en entrevista técnica

El backend se mantiene intencionalmente simple para enfocar el esfuerzo en la solución frontend, tal como lo indica el desafío.