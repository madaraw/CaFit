# CaFit - Custom Workout & Tracking App

CaFit is a fitness web app that allows users to create a custom workout plan, replace exercises, and track their weight progress. Built with Vue.js, TailwindCSS, and PrimeVue, this project showcases web app development skills and is open-source.

## Features

-   **Custom Workout Plan**: Set intensity, session time, and weekly workouts.
-   **Exercise Selection**: Choose exercises for each body part from a modified exercise database.
-   **Weight Tracking**: Monitor your working set weight for each exercise.
-   **Local Storage**: Saves all data locally without authentication.
-   **Responsive Design**: Works on various devices (though not fully optimized).

## Demo

[Live App on Vercel](https://cafit.vercel.app/)

## Tech Stack

-   **Frontend**: Vue.js, TailwindCSS, PrimeVue
-   **Storage**: LocalStorage (no backend or authentication)
-   **Data Source**: Modified dataset from [free-exercise-db](https://github.com/yuhonas/free-exercise-db)

## Modifications to the Exercise Database

-   Added `weightSet` parameter (default: `0`) for each exercise.
-   Added `primaryMuscle` as a single string instead of an array.

## Installation & Setup

1. Clone the repository:
    ```sh
    git clone https://github.com/madaraw/cafit.git
    cd cafit
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Run the development server:
    ```sh
    npm run dev
    ```
4. Open `http://localhost:5173/` in your browser.

## Future Improvements

-   Track workouts per session (not just max weight) with detailed graphs.
-   UI/UX improvements for a better experience.
-   Authentication & database integration for persistent data storage.

## License

This project is open-source and built for portfolio purposes.

---

### Contributions & Feedback

Feel free to fork, modify, or suggest improvements!
