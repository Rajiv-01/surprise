/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        handwritten: ["Caveat", "cursive"],
        cursive: ["Pacifico", "cursive"],
      },

      colors: {
        // This 'colors' block is now correctly placed and merged.
        pink: {
          50: "#FCE4EC",
          100: "#F8BBD0",
          200: "#F48FB1",
          300: "#F06292",
          400: "#EC407A",
          500: "#E91E63",
          600: "#D81B60",
          700: "#C2185B",
          800: "#AD1457",
          900: "#880E4F",
        },
        "romantic-pink": "#ff6b95",
        "romantic-purple": "#7c3aed",
      },

      animation: {
        // Renamed 'float' to 'float-default' to avoid conflict with 'float-slow'
        "float-default": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s ease-in-out infinite",
        // Renamed 'bounce-slow' to 'bounce-default' if you want a base bounce
        // Or ensure it maps to a unique keyframe.
        // If you intended 'bounce-slow' to use the 'bounce' keyframe, that's fine.
        // The issue was having 'bounce' and 'bounce-slow' both calling 'bounce' keyframe.
        // Let's assume 'bounce-slow' uses the 'bounce' keyframe already.
        // The problem was the additional `bounce: "bounce 2s ease-in-out infinite",` line.
        "fade-in": "fadeIn 0.8s ease-out",
        "float-slow": "float-slow-keyframe 8s ease-in-out infinite", // Mapped to a new unique keyframe name
        pop: "pop 0.5s ease-out forwards",
        catch: "catch 0.5s ease-out forwards",
        "slide-left": "slideLeft 15s linear infinite",
        "slide-right": "slideRight 15s linear infinite",
        firework: "firework 2s ease-out forwards",
        "animal-bounce": "animalBounce 3s ease-in-out infinite",
        "message-float": "messageFloat 8s ease-in-out infinite",
        // float: "float 3s ease-in-out infinite", // Removed duplicate
        wiggle: "wiggle 2s ease-in-out infinite",
        // bounce: "bounce 2s ease-in-out infinite", // Removed duplicate
      },
      keyframes: {
        float: {
          // This keyframe is used by 'float-default'
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        // Adding a new keyframe for 'float-slow' to ensure uniqueness if needed
        "float-slow-keyframe": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }, // This was the content of the duplicate 'float'
        },
        slideLeft: {
          "0%": { transform: "translateX(100vw)" },
          "100%": { transform: "translateX(-100vw)" },
        },
        slideRight: {
          "0%": { transform: "translateX(-100vw)" },
          "100%": { transform: "translateX(100vw)" },
        },
        firework: {
          "0%": { transform: "translateY(100%) scale(0)", opacity: "1" },
          "50%": { transform: "translateY(0) scale(1)", opacity: "1" },
          "100%": { transform: "translateY(0) scale(2)", opacity: "0" },
        },
        animalBounce: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-30px) rotate(10deg)" },
        },
        messageFloat: {
          "0%": {
            transform: "translateY(0) translateX(0) rotate(0deg)",
            opacity: "0",
          },
          "20%": { opacity: "1" },
          "80%": { opacity: "1" },
          "100%": {
            transform: "translateY(-100px) translateX(50px) rotate(10deg)",
            opacity: "0",
          },
        },
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        pop: {
          "0%": { transform: "translate(-50%, -50%) scale(0.8)", opacity: "1" },
          "50%": {
            transform: "translate(-50%, -50%) scale(1.2)",
            opacity: "0.8",
          },
          "100%": {
            transform: "translate(-50%, -50%) scale(1.5)",
            opacity: "0",
          },
        },
        catch: {
          "0%": { transform: "translate(-50%, -50%) scale(0.8)", opacity: "1" },
          "50%": {
            transform: "translate(-50%, -50%) scale(1.2)",
            opacity: "0.8",
          },
          "100%": {
            transform: "translate(-50%, -50%) scale(1.5)",
            opacity: "0",
          },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        bounce: {
          // This keyframe is used by 'bounce-slow'
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px) scale(1.05)" },
        },
      },
      backgroundImage: {
        "gradient-romantic":
          "linear-gradient(135deg, #fce7f3 0%, #ede9fe 100%)",
        "gradient-radial":
          "radial-gradient(circle at center, var(--tw-gradient-stops))",
      },
      borderWidth: {
        3: "3px",
      },
    },
  },
  plugins: [],
};
