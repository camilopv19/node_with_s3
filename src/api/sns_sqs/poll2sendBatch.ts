import AWS from 'aws-sdk';

const sqs = new AWS.SQS({ region: process.env.AWS_REGION }); // Replace with your desired region
const sns = new AWS.SNS({ region: process.env.AWS_REGION }); // Replace with your desired region
const queueUrl = process.env.AWS_SQS_QUEUE; // Replace with your SQS queue URL
const topicArn = process.env.AWS_SNS_TOPIC; // Replace with your SNS topic ARN

export async function pollSQSMessages(): Promise<void> {
  const batchSize = 10; // Number of messages to retrieve in each batch

  try {
    const receiveParams = {
      QueueUrl: queueUrl || '',
      MaxNumberOfMessages: batchSize,
      WaitTimeSeconds: 20, // Long polling for messages
    };

    const response = await sqs.receiveMessage(receiveParams).promise();

    if (response.Messages && response.Messages.length > 0) {
      const publishPromises = response.Messages.map((message) => {
        const publishParams = {
          TopicArn: topicArn,
          Message: message.Body!,
        };

        return sns.publish(publishParams).promise();
      });

      await Promise.all(publishPromises);

      // Delete the processed messages from the SQS queue
      const deleteParams = {
        QueueUrl: queueUrl || '',
        Entries: response.Messages.map((message) => ({
          Id: message.MessageId!,
          ReceiptHandle: message.ReceiptHandle!,
        })),
      };

      await sqs.deleteMessageBatch(deleteParams).promise();
    }
  } catch (error) {
    console.error('Error processing SQS messages:', error);
    throw error;
  }
}
