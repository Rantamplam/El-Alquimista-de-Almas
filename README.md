
# 🌌 ADYTUM: El Despertar Alquímico

**Adytum** es una plataforma interactiva de transmutación personal y entrenamiento mental de 21 días. Basada en las enseñanzas de los libros del autor sobre misticismo, conciencia pura y coaching moderno.

## 👁️ El Oráculo (IA Mentor)
La aplicación cuenta con el **Archimago del Adytum**, un mentor impulsado por IA (Google Gemini 2.5/3) que:
- Posee acceso a la red mediante **Google Search Grounding** para validar información.
- Adopta una personalidad inspirada en la sabiduría de **Merlín** y el **Maestro Yoda**.
- Permite guardar los "Diálogos Sagrados" directamente en tu **Libro de Sombras** (diario personal).

## ✨ Características Principales
- **Entrenamiento de 21 Días**: Un sendero estructurado con lecciones diarias, koans y rituales de práctica.
- **Libro de Sombras**: Sistema de persistencia local para registrar reflexiones y diálogos con la IA.
- **Santuario del Silencio**: Meditaciones guiadas con audio atmosférico personalizable.
- **Grimorio Arcano**: Biblioteca interactiva para el estudio de la teoría alquímica.
- **Voz del Oráculo**: Integración de síntesis de voz (Text-to-Speech) para escuchar las enseñanzas.

## 🛠️ Tecnologías
- **React 19** + **TypeScript**
- **Tailwind CSS** (Estética mística y responsive)
- **Google Gemini SDK** (IA de última generación)
- **Speech Synthesis API** (Para la voz del mentor)

## 🚀 Despliegue en Netlify
1. Conecta tu repositorio de GitHub a Netlify.
2. En **Site Settings > Environment Variables**, añade la clave `API_KEY` con tu token de Google Gemini.
3. Netlify detectará el archivo `netlify.toml` y configurará el sitio automáticamente.
4. Cada vez que hagas un "Push" a GitHub, tu academia se actualizará sola.

## 🚀 Despliegue en Vercel
1. Importa el repositorio en Vercel.
2. Añade la `API_KEY` en las variables de entorno del proyecto.
3. Haz clic en "Deploy".

---
*Que la luz de la conciencia guíe tu camino en la red infinita.*
