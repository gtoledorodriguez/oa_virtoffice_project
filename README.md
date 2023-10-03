# OA_VirtOffice_Project_Code
This is the starting basis to make a virtual office for employers and coworkers to join remotely but have the in-office feeling

# Get Code Running

1.  Go to your local directory in your terminal

        You'll see 2 directories: client and server

2. Go to the server directory
    `cd server`

3. Install all dependencies
    `npm install`

4. Go to the server source directory
    `cd src`

5. Start your backend server
    `node index.js`

        If it starts successfully, you should see *"Server is running on port 8080"*

6. Keep your server running and open a new terminal
    - Go to your local directory in your terminal

7. Go to the client directory
    `cd client`

8. Install all dependencies
    `npm install`

9. Build frontend code
    `npm run-script build`

        You can ignore the warnings. If it builds successfully, you should see *"The build folder is ready to be deployed"* towards the end

10. Start your frontend server
    `serve -s build` or `npx serve -s build`

11. Open a browser window and go to http://localhost:3000/

12. You should see a map with a character in the middle