# Description
Working as a four man team in a project called Quizzer. The project lasts six weeks so three two week Sprints. In releases there is a release for each Sprint. 

Quizzer is a full-stack web application for creating, managing, and taking quizzes. It features a React + TypeScript frontend with Tailwind CSS for styling, and a Java Spring Boot backend with a REST API and H2 database. Teachers can create, edit, categorize, and publish quizzes, while students can browse and complete published quizzes by category.

# Team members
* [Jarno Ryhänen](https://github.com/JarnoRyhanen)
* [Matti Pohjanoksa](https://github.com/MatPohj)
* [Valtteri Vuokila](https://github.com/Valheri)
* [Ville Stolt](https://github.com/Vsto99)
  
# Backlog
[Link to the Backlog](https://github.com/orgs/FullFlip/projects/1)

# Technologies used in this project
## Backend
- Programming Language: Java ( 17 ) 
- Framework: Spring boot
- In development H2 Database
- In production xx
## Frontend
- Programming Language: TypeScript
- Framework: React
- Build Tool: Vite
- Styling: Tailwind CSS
  
Major Libraries used in the Frontend:
   - React Router Dom
   - Tailwind

# Data diagram
```mermaid
classDiagram
direction LR

class Category {
  +Long ID
  +String Name
  +String Description
}

class Quiz {
  +String title
  +String description
  +String courseCode
  +Boolean publishedStatus
  +List~Question~ questions
}

class Question {
  +String title
  +Integer difficulty
  +List~Choice~ choices
}

class Choice {
  +Boolean isTrue
  +String description
}

class Answer {
  +String description
}

Category "0..1" -- "0..*" Quiz
Quiz     "1"    -- "0..*" Question
Question "1"    -- "1..*" Choice
Choice   "1"    -- "0..*" Answer

```
# Instructions
## Basic setup
1. Clone the repository
 ```
git clone https://github.com/FullFlip/Quizzer.git
 ```
2. Go to the folder
 ```
cd Quizzer
 ```
3. Open the application to VScode.
 ```
code .
 ```
If that didn't work just open the Quizzer folder inside ur preferred IDE

4. Run the application from the __QuizzerApplication.java__ file or start the program from Spring boot dashboard
5. Go to front end folder
 ```
cd Frontend
 ```
6. Install dependencies
 ```
npm install
 ```
7. After they are installed you can start the front end
 ```
npm run dev
 ```
8. The output is probably something like
 ```

  VITE v6.2.4  ready in 620 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
 ```
9. Go to the link and enjoy

