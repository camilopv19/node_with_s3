### Original project: [Creating Node.js REST APIs for AWS S3 - Upload, List, and Delete files](https://siddharthac6.medium.com/creating-node-js-rest-apis-for-aws-s3-upload-list-and-delete-files-608cc3569c0b)
### Original repo: https://github.com/SiddharthaChowdhury/AWS_S3_Node_REST
# AWS: Create IAM User
Create IAM user AWS with [ **Access type**: `Programmatic access` ], I named mine `ex3_s333`

1. Next step "**Set permissions**" -> Click "**Attach existing policies directly**"
2. Then search with keyword "`s3`"
3. To make things simple I chose/checked option "**AmazonS3FullAccess**" policy name
4. Click "**Next:Tags**", I am not setting tags here.
5. Finish the process, click "**Next:Review**" -> click -> "**Create user**"
6. For ease of use, **REMEMBER** to download the CSV (contains this new user's access info) -> Save file -> Keep it safe ;)

# AWS: Create a bucket
To do so, from **"Servises"** -> click **"S3"**
- Click "**Create bucket**"
- Enter a valid + unique name. I named it "`mygallerybucket33`", then click "**Next**"
- I will keep everything default in "**Configure option**" section, click -> "**Next**"
- This step "**Set permissions**", 
    - ***`Uncheck`*** -> "**Block all public access**"
    - ***`Check`*** -> "**Block public access to buckets and objects granted through new public bucket or access point policies**"
    - ***`Check`*** -> "**Block public and cross-account access to buckets and objects through any public bucket or access point policies**"
    - **NOTE**: *Information are given below the checkboxes there, please read them to understand what they do.*
    - Acknowledge the alert checkbox.
    - Click -> **Next**
    - Click -> **Create bucket**
- You will find the created bucket in the bucket list
- Click to open your bucket, I clicked mine "`mygallerybucket33`"
- We need to make it publicly accessible, so click on **"Permissions"**
    - Click -> "**Access Control List**"
    - Navigate to "**Public access**" section and click -> "**Everyone**"
    - A pop up "**Everyone**" will appear to set further option
        - Under "**Access to the objects**" 
        - Check -> "`List objects`" and 
        <!-- - Check -> "`Write objects`" -->
        - Click -> **Save**
- Notice: The bucket is now publicly accessible.

# Run the app

1. `npm install`
2. Rename `sample_nodemon.json` > `nodemon.json`
3. Open `nodemon.json` > Replace all `<_xxxx_>` with valid credentials
2. `npm start`


## Tasks (traning for AWS dev cert)
### PART 1: Implement a subscription feature in your web application

1. Update your web application to include the following functions:
   - download an image by name
   - show metadata for the existing images
   - upload an image
   - delete an image by name
   - get metadata for a random image


2. After uploading some images, make some SQL queries to the RDS instance bypassing the web-application – for example, from the EC2 instances over SSH.
3. The image metadata should include last update date, name, size in bytes, and file extension.
### PART 2: Implement a subscription feature in your web application

1. Create a standard SQS queue named -uploads-notification-queue.
2. Create an SNS topic named -uploads-notification-topic.
3. Add two new endpoints in your web-applications :

    - subscribe an email for notifications
    - unsubscribe an email from notifications

4. After a user visits the subscription endpoint, the specified email should receive a confirmation message.
5. Whenever a user visits the unsubscription endpoint, AWS should stop sending the email notifications.
6. Whenever an image is uploaded using your web application, a message describing that event should be published to the SQS queue.
7. Update your web-application to run a scheduled background process which extracts the SQS messages in batch and sends them to the SNS topic.
8. The SNS notifications should be in plain text which includes:
    - an explanation that an image has been uploaded
    - the image metadata (size, name, extension)
    - a link to the web application endpoint for downloading the image
    - Optional: add an additional attribute to the message your app will send to the SNS topic (such as an image extension) and configure the filtering policy for subscriptions to accept messages with a specific attribute value (such as .png).
