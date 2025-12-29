# 📝 Respuestas Técnicas del Proyecto

## 1. ¿Cuáles fueron los principales desafíos que enfrentaste?

### Sincronización de Remote Config
Manejar el contexto de inyección de Angular para que los valores de Firebase estuvieran disponibles antes de renderizar la UI.

### Persistencia Híbrida
Asegurar que tanto las tareas como las categorías se mantuvieran sincronizadas en el almacenamiento local (@ionic/storage-angular) al ser entidades relacionadas.

## 2. ¿Qué técnicas de optimización de rendimiento aplicaste y por qué?

### CDK Virtual Scroll
Para manejar listas potencialmente grandes. En lugar de renderizar 1,000 elementos en el DOM (que ralentizaría el móvil), solo renderizamos los visibles.

### ChangeDetectionStrategy.OnPush
Redujimos la carga del CPU al decirle a Angular que solo verifique cambios cuando las referencias de los datos cambien, no en cada evento del sistema.

### Lazy Loading
La aplicación está modularizada para cargar solo lo necesario al inicio.

## 3. ¿Cómo aseguraste la calidad y mantenibilidad del código?

### Arquitectura de Servicios
Separamos la lógica de Firebase, Categorías y Tareas en servicios independientes para cumplir con el principio de responsabilidad única.

### Tipado Estricto
Uso de interfaces de TypeScript para evitar errores en tiempo de desarrollo.

### Conventional Commits
Uso de un historial de Git semántico para facilitar la trazabilidad de los cambios.
