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

# Heroku deployment (as single deployment)

[![Heroku App Status](https://img.shields.io/badge/heroku-deployed-success?logo=heroku)](https://fullflip-quizzer-b5ec0e5d6a2f.herokuapp.com/)

## Access Information

### Student View
- **URL**: [https://fullflip-quizzer-b5ec0e5d6a2f.herokuapp.com/](https://fullflip-quizzer-b5ec0e5d6a2f.herokuapp.com/)
- Default landing page accessible to all users

### Teacher View
- **URL**: [https://fullflip-quizzer-b5ec0e5d6a2f.herokuapp.com/secure-access-12345](https://fullflip-quizzer-b5ec0e5d6a2f.herokuapp.com/secure-access-12345)
- Access to quiz and category management.

> ⚠️ **Note**: In a production environment, you should change the secret access token and implement proper authentication. This simplified access method is for demonstration purposes only.

## Deployment Architecture
- **Single Dyno**: Frontend and backend combined in one deployment
- **Database**: PostgreSQL provided by Heroku
- **Environment**: Configuration managed through Heroku Config Vars

# Technologies used in this project
## Backend
- Programming Language: Java ( 17 ) 
- Framework: Spring boot
- In development H2 Database
- In production Heroku Postgres/ PostgreSQL
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

class Answer {
      +Long id
      +int totalAnswers
      +int correctAnswers
      +int wrongAnswers
  }
  class Category {
      +Long categoryId
      +String title
      +String description
  }
  class Choice {
      +Long choiceId
      +boolean isTrue
      +String description
  }
  class Question {
      +Long questionId
      +String title
      +String difficulty
  }
  class Quiz {
      +Long quizId
      +String title
      +String description
      +String courseCode
      +boolean publishedStatus
      +LocalDate publishedDate
  }
  class Review {
      +Long id
      +String comment
      +int reviewValue
      +String nickname
  }
  class Teacher {
      +Long teacherId
      +String name
      +String role
  }
  Question "1" --> "0..*" Choice : has
  Question "1" --> "0..*" Answer : has
  Quiz "1" --> "0..*" Question : contains
  Category "1" --> "0..*" Quiz : categorizes
  Teacher "1" --> "0..*" Quiz : creates
  Quiz "1" --> "0..*" Review : receives
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

10. For API documentation go to http://localhost:8080/swagger-ui/index.html  after sucesfully starting Spring Boot

11. To run tests either go to Testing tab on VScode (if that's ur IDE) or run them on your console.
Make sure you are in the root,
If on cmd use
 ```
  mvwn test
 ```
Or if on Powershell\Linux use
 ```
./mvwn test  or .\mvwn test
 ```
