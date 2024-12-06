## Why I made this website
I made this website because i had originally made a program in c++ that helps my dad manage his motogp fantasy league, making the process much faster, i dont know if i will actually host this website, but it would make it even easier for his friends. The fantasy league works like this: each member selects 5 real life riders of the season that they believe will end in the top 5 of the competition, and they also select an independent rider, a rider that is the only one on the team, that they believe will be the independent rider with the most points in the end of the season. So each member's points are calculated based on how many points the riders they selected currently have in the season.

## Distinctiveness and Complexity
### Distinctiveness
This website does use some elements from the network project, the social media aspect. Where the website differentiates from the network project is the fantasy league aspect, where the users are using the website to keep track of how their picks are fairing in the season and general talking about the fantasy league.
### Complexity
The website uses a lot of functionalities and features not present in the course, this includes django serializers, email automation and a complete react frontend. The serializers are used not just for serializing data for the frontend, but also validating data. The email automation is used for when activating accounts or using the forgot password function, where just like other websites it gives a temporary link to perform these actions. The biggest addition to the complexity is the react frontend, where django manages 0 of the frontend, all it does is render the index.html file which is where the react frontend does all of its work. I essentially learned it all with this website and went through various versions of how I structured it. There are some components that are outdated that still work and some sections where it uses a slightly different methodology, but overall I am satisfied with the frontend, it doesn't do unnecessary request to the server.

## Files
I dont think i could go through all the files, but the frontend application has all the react code, and the api application has all the backend code. In the backend I separated the view into different folders and files, some views needed a folder because I had created a system for some of the views where it would validate data and generate the data dictionary needed for the serializers to then later create and save said data in the database. I went with this approach because the views and the way I was getting the serializers to work without generating the dictionaries was really messy and unsustainable. The frontend has some complexity to it, there is an **Application Context Provider** where any component of the website has access to essential information, like user data, current season, etc. This is used to avoid unnecessary duplicate calls for user data and whatnot. Some of the more complex webpages are separated into multiple components, like the season edit page, where there are many components to avoid accumulation of a lot of code, making it easier to navigate.


## Installation and Run
To run this website, you'll need to install these python packages:

django
django-cors-headers
django-rest-framework
selenium
six
pillow

On this website you wont need to run migrations, but if for some reason if the website doesn't work, you can delete the database file, and the migrations files in api and frontend and then run `python manage.py makemigrations api`, and then `python manage.py migrate`.

For the frontend, you'll need to install nodejs. And then cd into frontend and run `npm install webpack`. After its install you can run `npm run dev`. The website has other packages like babel, react, etc. But in my experience in the virtual machine it builds the code with only webpack installed.

Once the frontend is built, you can go back to the main directory and run the server. The website has an admin account that can be used to test the website:

**username**: cs50w_test
**password**: verystrongpassword

If you desire to test creating accounts, or using the forgot password function, you will need to associate an email to the django server. To do this, you will have to go to [Google Account](https://myaccount.google.com), search for App passwords, open the option that shows up and create an app password for the django website. When its created save it in the settings file, on line 143, and on line 142 put the email address that has the app password.