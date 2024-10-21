# Salesforce Lab Assistant Schedule Maker

This site is hosted on Vercel available at: https://schedule-maker-three.vercel.app

This project was created based on design specifications provided by the SJSU Salesforce Lab Leader.

This site simplifies the scheduling process for the Lab sections for SJSU's Salesforce Lab Assistant.
Given a list of all lab sections and lab instructors with their (in)availability, this website will generate an Excel file with a completed lab schedule.

Each Lab Section will be assigned to one Lab Assistant with the following guidelines:
 - Lab assistants will not be assigned to a Lab Section if they have conflicting availability
 - Lab assistants will have as close to an even number of assigned sections as possible
 - Lab sections are scheduled any time of the day: Monday, Tuesday, Wednesday, Thursday, Friday, Monday/Wednesday, or Tuesday/Thursday
