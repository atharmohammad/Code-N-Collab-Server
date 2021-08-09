<p align="center">
<a href="https://code-n-collab.netlify.app/" target="_blank"  rel="noreferrer">
<img src="https://user-images.githubusercontent.com/56029409/120935296-af116b00-c71f-11eb-8a47-9ca6a54832db.png" height="90"
     style="border-radius:50%"/>
<img src="https://user-images.githubusercontent.com/56029409/120934611-a10e1b00-c71c-11eb-8f9a-c22ecfc82652.png" height="70">
</a>
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

<a href="https://code-n-collab.netlify.app/" target="_blank"  rel="noreferrer">
<table >
   <tr>
     <td>
        <img src="Images/homepage.PNG"/>
     </td>
     <td >
       <img src="Images/profile.PNG"/>
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
 
 <a href="https://code-n-collab.netlify.app/" target="_blank"  rel="noreferrer">
      <table align="center">
          <tr>
               <td>
                    <img src="gif/codencollab.gif" alt="Collaboration" height="200"/>
               </td>
          </tr>
     </table>
</a>
 

# 🔖 About 
Code-N-Collab server is backend for Code-N-Collab , It make Code-N-Collab real-time collaborative using sockets and also serves as backend for blogs

### Website
[Code-N-Collab](https://code-n-collab.netlify.app/)

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
- <a href="https://console.cloud.google.com/">Google Cloud Platform</a>

#### Setup your free GCP account for google Oauth
- https://support.google.com/cloud/answer/6158849?hl=en

- Setup API&Credentials for Web Application

- Provide a Redirect URI in the Credentials(The redirect_URI will be used to redirect to the page after login with google,in below environment variable example we have setup redirect_URI=http://localhost:3000/homepage/ , using port 3000 you can use any port but make sure to add /homepage after that to redirect to correct route)

- copy <YOUR_GOOGLE_CLIENT_ID> and <YOUR_GOOGLE_CLIENT_SECRET>

#### Setup your MONGO_DB atlas
- <a href="https://docs.atlas.mongodb.com/getting-started/">Atlas Docs</a>
- get the <MONGO_DB_URL> from your cluster , you have to use it in env vars

#### Setup Environment variables 
Go to /src/Function/getKey.js and remove 3 lines as below from the keys array 

``` 
  [process.env.COMPILE_CLIENT_ID2, process.env.COMPILE_CLIENT_SECRET2],
  [process.env.COMPILE_CLIENT_ID3, process.env.COMPILE_CLIENT_SECRET3],
  [process.env.COMPILE_CLIENT_ID4, process.env.COMPILE_CLIENT_SECRET4],
```

- now you can declare your env vars using dotenv like below :

```
     CORS_ORIGIN=*
     GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>
     GOOGLE_CLIENT_SECRET=<YOUR_GOOGLE_CLIENT_SECRET>
     redirect_URI=http://localhost:3000/homepage/
     BaseURI=http://localhost:8080/
     MONGO_DB_URL=<YOUR_MONGO_DB_URL>
     COMPILE_CLIENT_ID1=<COMPILE_CLIENT_ID1>
     COMPILE_CLIENT_SECRET1=<COMPILER_CLIENT_SECRET1>

```
- or you can declare your env vars in nodemon.json if you are using nodemon for development like below:
```
{
    "env":{
        "CORS_ORIGIN":"*",
        "GOOGLE_CLIENT_ID": "<YOUR_GOOGLE_CLIENT_ID>",
        "GOOGLE_CLIENT_SECRET": "<YOUR_GOOGLE_CLIENT_SECRET>",
        "redirect_URI" : "http://localhost:3000/homepage/",
        "BaseURI":"http://localhost:8080/",
        "MONGO_DB_URL":"<YOUR_MONGO_DB_URL>"
        "COMPILE_CLIENT_ID1":"<COMPILE_CLIENT_ID1>"
        "COMPILE_CLIENT_SECRET1":"<COMPILER_CLIENT_SECRET1>"
      }
}

```

### Installation

```
   $ git clone https://github.com/<your-username>/Code-N-Collab-Server.git
   $ cd Code-N-Collab-Server
   $ git remote add upstream https://github.com/atharmohammad/Code-N-Collab-Server.git
   $ npm install
   
   $ npm start // if you are using dotenv
   
   //or
   
   $ npm run dev // if you are using nodemon.json 
   
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
- <a href="https://docs.atlas.mongodb.com/getting-started/">Atlas Docs </a>
- <a href="https://github.com/scniro/react-codemirror2">React-Codemirror Editor Docs</a>
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

