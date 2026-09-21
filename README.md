# P-38: Determination & Variations of Acceleration Due to Gravity (g)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black.svg?logo=vercel)](https://p-38-variation-of-g-geophysics.vercel.app)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646cff.svg?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![Author: Shamsuddin Piash](https://img.shields.io/badge/Author-Shamsuddin%20Piash-0ea5e9.svg)](https://piashoverflow.github.io)
[![BUET ME](https://img.shields.io/badge/Institution-BUET%20'25-10b981.svg)](https://buet.ac.bd)

> **Interactive Geophysics & Gravitational Mechanics Simulator**  
> Developed by **Shamsuddin Piash** | Department of Mechanical Engineering, Bangladesh University of Engineering and Technology (BUET).  
> Covers **HSC Physics 1st Paper, Chapter 6 (Gravitation & Gravity / মহাকর্ষ ও অভিকর্ষ)** — Topic Code **P-38**.

---

## 🔬 Core Physics Principles & Geophysics Equations

### 1. Fundamental Definition & Surface Value of $g$
Relating Newton's gravitational constant $G$ with planetary mass $M$ and radius $R$:
$$g = \frac{GM}{R^2} \approx 9.81 \text{ m/s}^2$$

---

### 2. Variation of $g$ at Altitude ($h$) Above Earth's Surface (উচ্চতার জন্য পরিবর্তন)
At height $h$ above sea level:
- **Exact Equation**:
  $$g_h = g \left(\frac{R}{R + h}\right)^2$$
- **Binomial Approximation ($h \ll R$)**:
  $$g_h \approx g \left(1 - \frac{2h}{R}\right)$$
- **Fractional Gravity Loss**: $\frac{\Delta g}{g} = \frac{2h}{R}$

---

### 3. Variation of $g$ at Depth ($d$) Below Earth's Surface (ভূ-অভ্যন্তরে গভীরতা)
Inside a uniform sphere, only the interior mass sphere of radius $(R - d)$ exerts net gravitational force:
$$g_d = g \left(1 - \frac{d}{R}\right)$$
- At Earth's core ($d = R$): $g_c = 0$ (Complete gravitational symmetry / zero gravity).
- Depth vs. Altitude Equivalence: For small heights and depths, $g_h = g_d \implies d = 2h$.

---

### 4. Variation of $g$ Due to Earth's Oblate Shape (আহ্নিক ব্যাসার্ধ ও আকার)
Because Earth is an oblate spheroid flattened at the poles:
- Equatorial radius: $R_e = 6,378\text{ km} \implies g_e \approx 9.780\text{ m/s}^2$
- Polar radius: $R_p = 6,357\text{ km} \implies g_p \approx 9.832\text{ m/s}^2$
- Since $g \propto 1/R^2$ and $R_e > R_p$, gravity is maximum at the poles and minimum at the equator.

---

### 5. Variation of $g$ Due to Diurnal Rotation & Weightlessness (আহ্নিক গতি ও ১৭ গুণ ঘূর্ণন)
Centrifugal acceleration at geodetic latitude $\lambda$:
$$g_\lambda = g - \omega^2 R \cos^2\lambda$$
- At poles ($\lambda = 90^\circ$): $g_{\text{pole}} = g$ (no centrifugal reduction).
- At equator ($\lambda = 0^\circ$): $g_{\text{equator}} = g - \omega^2 R$.
- **17x Weightlessness Threshold**:
  $$g - \omega'^2 R = 0 \implies \omega' = \sqrt{\frac{g}{R}} \approx 1.24 \times 10^{-3} \text{ rad/s} \approx 17\omega_0$$
  If Earth rotates 17 times faster, equatorial day length shortens to **84.6 minutes** and all objects on the equator become weightless!

---

## 🚀 Getting Started & Local Development

```bash
# Clone repository
git clone https://github.com/piashoverflow/P-38-Variation-Of-G-Geophysics.git
cd P-38-Variation-Of-G-Geophysics

# Install dependencies
npm install

# Launch Vite development server
npm run dev

# Build for production / Vercel
npm run build
```

---

## 🌐 1-Click Deployment to Vercel
This project is configured for out-of-the-box zero-config deployment on [Vercel](https://vercel.com). Simply import this repository into your Vercel dashboard and click **Deploy**.

---

## 📜 License
MIT License © 2026 **Shamsuddin Piash**. See [LICENSE](LICENSE) for details.
