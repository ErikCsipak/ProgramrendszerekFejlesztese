# Prompts that worked and didn't work

Here I will reflect on the prompts I used during the development of the project, identifying which ones were effective and which ones were not.

## What Worked
**Detailed Prompts**: Mostly handing over detailed prompts that outlined specific tasks and steps to take was effective.

---

e.g. when I asked:

`I'm working on a CRUD school project, that implements a system, where admins can create and share courses with students. Teachers can create and edit courses where they are the teachers (owners), but they can't share it with students. Courses created by the teachers are in in_plan status, and can only be opened, if an admin accepts it. Details of the course must contain the name, description, scheduling, limit of students, name of the teacher. Students can only join courses that are not filled up. Students can also list available courses and courses, that they already joined to. Students must first register to the system. Teachers and admins are pre-registered. Help me design this system. I plan to use quarkus (panache, lombok, etc..) and angular. For database either firebase or a simple postgresql. I also want to containerize the projects, so that a docker image is available to be deployed at the end.`

Answer:

` I'll help you design this school course management system. This is a good opportunity to plan the architecture before implementation. Let me enter plan mode to explore your current codebase and then design a comprehensive system for you.`

` Now I'm in plan mode. Let me explore your current codebase to understand what already exists, then I'll design a comprehensive system architecture for you. `

` Perfect! I can see your project is currently a skeleton with just Docker setup. Now let me clarify a few architectural decisions before I design the system:`

` Excellent! Now I have all the details I need. Let me create a comprehensive design plan for your system:`

Here I couldn't really export the conversation from vscode, but this prompt gave me the base of the application. It created the quarkus, angular app with containerization, and also created the architecture of the application. It was a great starting point for the project. This prompt was followed by lots of debugging and refining, but at the end the application was running.

---

e.g. when I asked:

`How can I run the compose with docker desktop under windows?`


Answer:
```
<html>
  <head>

  </head>
  <body>
    <p style="margin-top: 0px">
      Absolutely &#8212; here&#8217;s the quickest way on Windows with Docker Desktop.
    </p>
    <ul>
      <li>
        <strong>Plan:</strong> verify Docker Desktop is ready, run Compose 
        from the project root, then confirm services and URLs.
      </li>
    </ul>
    <h3>
      Checklist
    </h3>
    <ul>
      <li>
        <input type="checkbox" disabled="#DEFAULT">
        Start Docker Desktop (wait until it says Docker is running)
      </li>
      <li>
        <input type="checkbox" disabled="#DEFAULT">
        Open PowerShell in <code>D:\Projects\SZTE\ProgramrendszerekFejlesztese</code>
      </li>
      <li>
        <input type="checkbox" disabled="#DEFAULT">
        Start Compose
      </li>
      <li>
        <input type="checkbox" disabled="#DEFAULT">
        Check containers are healthy
      </li>
      <li>
        <input type="checkbox" disabled="#DEFAULT">
        Open the app/API in browser
      </li>
    </ul>
    <p>
      Run:
    </p>
    <pre data-copilot-type="code-block" data-copilot-offset="431,535" data-copilot-content-offset="445,532" data-copilot-code-block-index="0" data-copilot-code-language="powershell"><code>Set-Location &quot;D:\Projects\SZTE\ProgramrendszerekFejlesztese&quot;
docker compose up --build</code></pre>
    <p>
      If your Docker installation uses the old syntax, use:
    </p>
    <pre data-copilot-type="code-block" data-copilot-offset="592,635" data-copilot-content-offset="606,632" data-copilot-code-block-index="1" data-copilot-code-language="powershell"><code>docker-compose up --build</code></pre>
    <p>
      In another PowerShell window, verify status:
    </p>
    <pre data-copilot-type="code-block" data-copilot-offset="683,779" data-copilot-content-offset="697,776" data-copilot-code-block-index="2" data-copilot-code-language="powershell"><code>Set-Location &quot;D:\Projects\SZTE\ProgramrendszerekFejlesztese&quot;
docker compose ps</code></pre>
    <p>
      Then open:
    </p>
    <ul>
      <li>
        Frontend: <code>http://localhost</code> (as documented for nginx in 
        Compose)
      </li>
      <li>
        Backend API: <code>http://localhost:8080/api</code>
      </li>
      <li>
        Health: <code>http://localhost:8080/health</code>
      </li>
    </ul>
    <p>
      To stop:
    </p>
    <pre data-copilot-type="code-block" data-copilot-offset="955,992" data-copilot-content-offset="969,989" data-copilot-code-block-index="3" data-copilot-code-language="powershell"><code>docker compose down</code></pre>
    <p>
      If you want, I can also give you a Windows-specific &#8220;first-time Docker 
      Desktop sanity check&#8221; (WSL2/backend, virtualization, and common 
      port-conflict fixes).
    </p>
  </body>
</html>

```
This prompt was very helpful for me, because I had some issues with running the docker compose on windows. It gave me a clear checklist of steps to follow, and also provided the exact commands to run, while also prompting me if it can run the commands, to which I said yes. This way it started the docker compose and I could verify that the containers were running and healthy. It also provided the URLs to access the frontend and backend, which was very helpful. 

---

e.g. when I asked:

`Let's add a new flyway sql script to add test users, one with admin and one with teacher roles.`

Andwer:
```
<html>
  <head>
    
  </head>
  <body>
  </body>
</html>

<html>
  <head>
    
  </head>
  <body>
  </body>
</html>

<html>
  <head>
    
  </head>
  <body>
    <p style="margin-top: 0px">
      Done &#8212; I added a Flyway SQL migration that follows the project's 
      conventions and inserts an admin and a teacher user.
    </p>
    <p>
      What I added
    </p>
    <ul>
      <li>
        <code>backend/src/main/resources/db/migration/V2__Create_default_users.sql</code>

        <ul>
          <li>
            Idempotent DO $$ block that inserts:

            <ul>
              <li>
                admin@example.com (role ADMIN)
              </li>
              <li>
                teacher@example.com (role TEACHER)
              </li>
            </ul>
          </li>
          <li>
            Both rows use placeholders: ADMIN_HASH_REPLACE_ME and 
            TEACHER_HASH_REPLACE_ME for the Argon2 password hashes.
          </li>
        </ul>
      </li>
    </ul>
    <p>
      Why placeholders?
    </p>
    <ul>
      <li>
        The application uses Argon2 for password hashing (see <code>PasswordEncoder</code>), 
        so the password values must be Argon2-encoded strings (not plaintext).
      </li>
      <li>
        I couldn't generate Argon2 hashes in this environment because Maven 
        wasn't available here earlier. To keep the migration deterministic and 
        reviewable (SQL), the migration contains placeholders that you should 
        replace with the actual Argon2 hashes.
      </li>
    </ul>
    <p>
      I also prepared helper tooling (previous change)
    </p>
    <ul>
      <li>
        <code>backend/src/main/java/tools/HashGenerator.java</code> &#8212; prints 
        Argon2 hashes for the example passwords (<code>admin123</code> and <code>teacher123</code>) 
        using the same parameters as <code>PasswordEncoder</code> (t=2, 
        m=65536, p=1). Use this to generate the strings to paste into the SQL 
        migration.
      </li>
    </ul>
    <p>
      Next steps for you (run locally)
    </p>
    <ol>
      <li>
        Build and run the hash generator (PowerShell commands):

        <ul>
          <li>
            If you have Maven:

            <pre data-copilot-type="code-block" data-copilot-offset="1290,1435" data-copilot-content-offset="1294,1427" data-copilot-code-block-index="0"><code>mvn -f backend/pom.xml -DskipTests package
java -cp backend/target/classes;backend/target/dependency/* tools.HashGenerator</code></pre>
            <p>
              The program will print two lines: ADMIN_HASH: 
              &lt;span&gt;argon2id&lt;/span&gt;... TEACHER_HASH: &lt;span&gt;argon2id&lt;/span&gt;...
            </p>
          </li>
        </ul>
      </li>
      <li>
        Edit <code>backend/src/main/resources/db/migration/V2__Create_default_users.sql</code> 
        and replace:

        <ul>
          <li>
            ADMIN_HASH_REPLACE_ME with the printed admin hash (including the <code>$argon2id$...</code> 
            prefix)
          </li>
          <li>
            TEACHER_HASH_REPLACE_ME with the printed teacher hash
          </li>
        </ul>
      </li>
      <li>
        Commit and start the application. Flyway will run the SQL migration 
        and insert the users (only if they don't already exist).
      </li>
    </ol>
    <p>
      If you want, I can:
    </p>
    <ul>
      <li>
        Replace the placeholders and commit the real migration file for you &#8212; 
        paste the two generated Argon2 hashes here and I'll update the SQL 
        file.
      </li>
      <li>
        Or, if you'd prefer, I can try to generate the hashes here &#8212; but 
        earlier the environment lacked Maven, so you'll likely need to run the 
        commands locally or allow me to run them if you enable Maven in the 
        environment.
      </li>
    </ul>
    <p>
      Which would you like me to do next?
    </p>
  </body>
</html>
```

This prompt really surprised me, because not only it added the scripts, but also used the argon generator to generate the hashes for the passwords, and also provided detailed instructions on how to run the generator and update the SQL file. It was a very comprehensive, and also covered things that I didn't even think about.

## What Didn't Work
**Vague Prompts**: When I asked for more general or vague tasks without specific steps, it didn't always do what I expected. There was specifically a problem that we couldn't fix, which was that sometimes the endpoints gave a ConcurrentModificationException, which was caused by the fact that the same entity was being modified by two different threads. This was a problem that I had to fix manually, and it was not something that the prompts could help with.

---

e.g. when I asked multiple times something similar to:

```
<html>
  <head>
    
  </head>
  <body>
    <p style="margin-top: 0px">
      I found some bugs. Help me fix them: I get Unhandled exception: 
      java.util.ConcurrentModificationException on the backend when try to get 
      the details of a course or when I try to list available courses. Also, 
      when I'm logged in as a teacher, I can't see the courses I created. For 
      concurrency issue I found a possible solution on stackoverflow:<br>This 
      is not a synchronization problem. This will occur if the underlying 
      collection that is being iterated over is modified by anything other 
      than the Iterator itself.
    </p>
    <p>
      Iterator it = map.entrySet().iterator();<br>while (it.hasNext()) {<br>Entry 
      item = it.next();<br>map.remove(item.getKey());<br>}
    </p>
    <p>
      This will throw a ConcurrentModificationException when the it.hasNext() 
      is called the second time.
    </p>
    <p>
      The correct approach would be
    </p>
    <p>
      Iterator it = map.entrySet().iterator();<br>while (it.hasNext()) {<br>Entry 
      item = it.next();<br>it.remove();<br>}
    </p>
    <p>
      Assuming this iterator supports the remove() operation.
    </p>
  </body>
</html>
```

I got the answer:
```aiignore
<html>
  <head>
    
  </head>
  <body>
    <p style="margin-top: 0px">
      I'll locate the ConcurrentModificationException issue in the backend 
      course services and fix both problems: the iterator modification issue 
      and the teacher courses visibility.
    </p>
  </body>
</html>

<html>
  <head>
    
  </head>
  <body>
    <p style="margin-top: 0px">
      I found both issues. Let me fix them:
    </p>
    <ol>
      <li>
        <strong>ConcurrentModificationException</strong> - in <code>CourseDto.from()</code> 
        line 42, the schedules collection is being iterated directly without 
        making a copy first
      </li>
      <li>
        <strong>Teachers can't see courses</strong> - the frontend isn't 
        sending the <code>teacherId</code> query parameter that the backend 
        now requires for the <code>/courses/mine</code> endpoint
      </li>
    </ol>
    <p>
      I'll fix both problems now.
    </p>
  </body>
</html>

```

But at the end, the problem was not fixed, and I had to look into the codebase, which reflected to something, that I also didn't think about. Generating the whole codebase with AI left me without the knowledge of how it is put together. So debugging something completely new was really hard, because it felt like as I have been put to a new project without any documentation, and I had to figure out how it works, and where the problem is. Of course I found the problem, since the whole application is not that big and complex, but in a real-world scenario this might not be that simple.

---

Most of the things that did not work were prompts similar to the above one. When asked to debug, it sometimes hallucinated, or even just stuck around an implementation and could think about a completely new solution. But most of the times even debugging worked pretty nicely. 

When asked simpler operations, like adding a new endpoint, or adding a new migration, it worked really well. Or even doing something on the frontend which is being visually represented to the user was really nice. E.g. I didn't ask it to stylize the application, but regardless it did it and it looks really-really good (in my opinion even better than the original Neptun.).

## Conclusion

In conclusion, I think that the prompts that were more specific, not about debugging, and had clear specifications to follow worked really well, while the more vague and general prompts didn't always give the expected results. But overall, the AI was really helpful in building the application, and it was a great experience to work with it. Doing a project like this would have taken me at least twice as much time without an AI agent, that's for sure. 
