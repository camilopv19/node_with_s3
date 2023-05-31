/**
 * Lambda to run the code that you wrote for module 7 for transferring SQS messages to SNS (DO NOT FORGET to remove that code
 * from the web-application to avoid functionality duplication)
 */
// import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
// import { SQSClient, ReceiveMessageCommand, DeleteMessageBatchCommand } from '@aws-sdk/client-sqs';
// const sqs = new SQSClient({ region: "us-east-1" });
// const sns = new SNSClient({ region: "us-east-1" });
// const queueUrl = process.env.AWS_SQS_QUEUE;
// const topicArn = process.env.AWS_SNS_TOPIC;

// export const handler = async (event, context) => {
//     console.log('event, context', { event, context });
//     const batchSize = 10; // Number of messages to retrieve in each batch
//     let response = {};
//     try {
//         const receiveParams = {
//             QueueUrl: queueUrl || '',
//             MaxNumberOfMessages: batchSize,
//             WaitTimeSeconds: 10, // Long polling for messages
//         };

//         response = await sqs.send(new ReceiveMessageCommand(receiveParams));

//         if (response.Messages && response.Messages.length > 0) {
//             const publishPromises = response.Messages.map((message) => {
//                 const publishParams = {
//                     TopicArn: topicArn,
//                     Message: message.Body,
//                 };

//                 return sns.send(new PublishCommand(publishParams));
//             });

//             const publishMsg = await Promise.all(publishPromises);
//             response.publishMsg = publishMsg;

//             // Delete the processed messages from the SQS queue
//             const deleteParams = {
//                 QueueUrl: queueUrl,
//                 Entries: response.Messages.map((message) => ({
//                     Id: message.MessageId,
//                     ReceiptHandle: message.ReceiptHandle,
//                 })),
//             };

//             const deleteBachMsg = await sqs.send(new DeleteMessageBatchCommand(deleteParams));
//             response.deleteBachMsg = deleteBachMsg;
//         }
//     } catch (error) {
//         console.error('Error processing SQS messages:', error);
//         throw error;
//     }
//     response.statusCode = 200;
//     response.event = event;
//     return response;
// };


// /**
//  * Create a separate Lambda function which simply takes in an S3 object creation event and logs the S3 object name
//  */
// export const handler = async(event) => {
//     try {
//       // Retrieve the S3 object information from the event
//       const s3Record = event.Records[0].s3;
//       const bucketName = s3Record.bucket.name;
//       const objectKey = s3Record.object.key;
  
//       console.log(`New S3 object created: ${objectKey}`);
      
//       // Perform any additional processing or actions here
      
//       return {
//         statusCode: 200,
//         body: 'Success',
//       };
//     } catch (error) {
//       console.error('Error processing S3 event:', error);
//       return {
//         statusCode: 500,
//         body: 'Error',
//       };
//     }
//   };