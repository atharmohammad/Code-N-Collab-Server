<p align="center">
<img src="https://user-images.githubusercontent.com/56029409/120935296-af116b00-c71f-11eb-8a47-9ca6a54832db.png" height="90"
     style="border-radius:50%"/>
<img src="https://user-images.githubusercontent.com/56029409/120934611-a10e1b00-c71c-11eb-8f9a-c22ecfc82652.png" height="70">
</p>
<br/>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![MIT License][license-shield]][license-url]
[![Issues][issues-shield]][issues-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#-about">About</a>
      <ul>
        <li><a href="#-features">Features</a></li>
      </ul>
    </li>
    <li>
      <a href="#-getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
      </ul>
         <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#-contribution-guidelines">Contributing</a></li>
    <li><a href="#-contact">Contact</a></li>
    <li><a href="#-resources">Resources</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

<a href="https://code-n-collab.netlify.app/" target="_blank" >
<table >
   <tr>
     <td>
        <img src="Images/homepage.PNG"/>
     </td>
     <td >
       <img src="Images/pofile.PNG"/>
     </td>
   </tr>
   <tr>
     <td>
       <img src="Images/championship.PNG" />
     </td>
     <td>
       <img src="Images/Blogs.PNG" />
     </td>
   </tr>
</table>
 </a>

# 🔖 About 
Code-N-Collab server is backend for Code-N-Collab , It make Code-N-Collab real-time collaborative using sockets and also serves as backend for blogs

## 🚀 Features
It provides users with :-
- Real-time code editor :
  to share your code and discuss about it with your collegues or solves a competitive coding problem and discuss it , you can also fetch CP problems from popular websites such as codeforces , codechef , atcoder , Cses , geeksforgeeks , etc. It also has a chat section for people to talk about the problem

- Lockout Championship :
  for people who are looking to compete on codeforces problemset , they can set their codeforces handle in profile section and enjoy competing with their friends and challenging on interesting problems which will be filter on user's choice and then randomly selects 5 problems in a problem rating range , To challenge your friend you just need to share your Url before starting the contest
  
- Blogs : 
  People can share their knowledge , learn and ask any thing in our blogs section 

## 🔥 Getting Started 

### Prerequisites

- <a href="https://reactjs.org/">Reactjs</a>
- <a href="https://nodejs.org/en/">Nodejs</a>

#### Setup Environment variables 
- you can declare your env vars using dotenv like below :
```
     GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>
     GOOGLE_CLIENT_SECRET=<YOUR_GOOGLE_CLIENT_SECRET>
     redirect_URI=http://localhost:3000/homepage/
     BaseURI=http://localhost:8080/
     MONGO_DB_URL=<YOUR_MONGO_DB_URL>

```
- or you can declare your env vars in nodemon.json if you are using nodemon for development like below:
- 
```
{
    "env":{
        "GOOGLE_CLIENT_ID": "<YOUR_GOOGLE_CLIENT_ID>",
        "GOOGLE_CLIENT_SECRET": "<YOUR_GOOGLE_CLIENT_SECRET>",
        "redirect_URI" : "http://localhost:3000/homepage/",
        "BaseURI":"http://localhost:8080/",
        "MONGO_DB_URL":"<YOUR_MONGO_DB_URL>"
      }
}

```

#### Setup Convergence 
To setup convergence server you have to download docker, for windows user they can download <a href="https://docs.docker.com/docker-for-windows/install/">Docker for Windows</a>

run the following command in your terminal

```
C:\Users\mohdr>docker run -p "8000:80" --name convergence convergencelabs/convergence-omnibus
```

### Installation

```
   $ git clone https://github.com/<your-username>/Code-N-Collab-Server.git
   $ cd Code-N-Collab-Server
   $ git remote add upstream https://github.com/atharmohammad/Code-N-Collab-Server.git
   $ npm install
   $ npm start
```

## 💁 Contribution guidelines 

 we encourage organizations and individuals to contribute requirements, documentation, issues, new templates, and code.
 For code contributions, read :
 
- The <a href="CODE_OF_CONDUCT.md" >Code of Conduct</a>
- The <a href="CONTRIBUTING.md">Contribution Guidelines</a>

## 📲 Contact

<a href="https://www.linkedin.com/in/athar-mohammad-34068a157/">Mohd Athar</a> - mohd.rule123@gmail.com
<br>
<a href="https://www.linkedin.com/in/adnan-shamsi-5830301b3/">Adnan Shamsi</a> - adnanshamsi023@gmail.com

## 📚 Resources 
- <a href="https://socket.io/docs/v4" >Socket.Io Documentation </a>
- <a href="https://convergence.io/documentation/" > Convergence Docs </a>
- <a href="https://docs.docker.com/docker-for-windows/install/">Docker for Windows</a> (For windows user)
- <a href="https://microsoft.github.io/monaco-editor/api/modules/monaco.editor.html">Monaco Editor Docs</a>
- <a href="https://mongoosejs.com/docs/guide.html">Mongoose Docs</a>

## License
<a href="LICENSE">Apache License 2.0</a>

[contributors-shield]: https://img.shields.io/github/contributors/atharmohammad/Code-N-Collab-Server.svg?style=for-the-badge
[contributors-url]: https://github.com/atharmohammad/Code-N-Collab-Server/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/atharmohammad/Code-N-Collab-Server.svg?style=for-the-badge
[forks-url]: https://github.com/atharmohammad/Code-N-Collab-Server/network/members
[stars-shield]: https://img.shields.io/github/stars/atharmohammad/Code-N-Collab-Server.svg?style=for-the-badge
[stars-url]: https://github.com/atharmohammad/Code-N-Collab-Server/stargazers
[issues-shield]: https://img.shields.io/github/issues/atharmohammad/Code-N-Collab-Server.svg?style=for-the-badge
[issues-url]: https://github.com/atharmohammad/Code-N-Collab-Server/issues
[license-shield]: https://img.shields.io/github/license/atharmohammad/Code-N-Collab-Server.svg?style=for-the-badge
[license-url]: https://github.com/atharmohammad/Code-N-Collab-Server/blob/master/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/athar-mohammad-34068a157/

