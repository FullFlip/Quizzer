# Quizzer
## Description
Working as a four man team in a project called Quizzer. The project lasts 6 weeks so three two week Sprints.

**More about the project**

### Team members
* [Jarno Ryhänen](https://github.com/JarnoRyhanen)
* [Matti Pohjanoksa](https://github.com/MatPohj)
* [Valtteri Vuokila](https://github.com/Valheri)
* [Ville Stolt](https://github.com/Vsto99)
  
### Backlog
[Link to the Backlog](https://github.com/orgs/FullFlip/projects/1)

### Data diagram
```mermaid
classDiagram
direction LR

class Category {
  +Long ID
  +String Name
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
