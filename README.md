# Semester-3-Group
A group project made for Sioux Technologies in Eindhoven.

The problem they wanted a solution to:
An appointment management system and parking spot occupation system for Sioux' guests.

Flow of our solution:
1. A guest calls the secretary with the request of making an appointment with employee x at a given time
2. The secretary makes an appointment with employee x for the guest
  -If the guest is coming by car, they have to give their license plate number to the secretary
3. An Outlook meeting invitation is automatically created and sent to both parties (it's also possible to reschedule and delete meetings through our solution)
...the day of the meeting comes...
4. The guest drives up to the entrance of the Sioux building
5. Our license plate scanning system scans the license plate and checks if there are upcoming appointments containing it
6. Our parking spot occupation tracking system sends the backend information on the current parking spot situation
7. The guest is sent an SMS message which tells them if there are any free spots in the main parking or if they will have to drive to the other one in case there aren't
8. Employee x, who has a meeting with the guest, is sent an email telling them in approximately how much time the guest will be in the lobby ready to be picked up (based on which parking the guest has to park on)

Technologies we worked with:
-Java 
-Springboot 
-Javascript 
-React 
-MySQL Workbench 
-Bootstrap 
-C 
-Arduino Uno 
-Python 
-Jupyter notebook 
-Tensorflow 
-Docker
-Twilio SMS services 
-JIRA
-Outlook API (we chose to work with Outlook because Sioux is already using it as the company-wide email)
