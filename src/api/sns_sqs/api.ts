import { Request, Response } from "express";
import AWS from 'aws-sdk';
import { pollSQSMessages } from "./poll2sendBatch";

const sqs = new AWS.SQS();
const sns = new AWS.SNS();

export const api_sns_sqs = (req: Request, res: Response) => {
    const { op } = req.params;
    const { email } = req.query;

    if (!['sub', 'unsub'].includes(op)) {
        res.status(400).json({ error: 'Invalid operation' });
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
        res.status(400).json({ error: 'Invalid email' });
        return;
    }

    if (op === 'sub') {
        // Subscribe email to SNS topic
        const params = {
            Protocol: 'email',
            TopicArn: process.env.AWS_SNS_TOPIC || 'YOUR_TOPIC_ARN', // Replace with your AWS SNS topic ARN
            Endpoint: email,
            ReturnSubscriptionArn: true,
        };

        sns.subscribe(params, async (err, data) => {
            if (err) {
                console.error('Error subscribing email:', err);
                res.status(500).json({ error: 'Failed to subscribe email' });
            } else {
                // Send email notification
                const emailParams = {
                    TopicArn: params.TopicArn,
                    Subject: 'Subscription Confirmation',
                    Message: `You have successfully subscribed to the topic.`,
                };
                await sns.publish(emailParams).promise();
                res.status(200).json({ message: 'Email subscribed successfully' });
            }
        });
    } else if (op === 'unsub') {
        // Retrieve the subscription ARN for the given email
        const listParams = {
            TopicArn: process.env.AWS_SNS_TOPIC || 'YOUR_TOPIC_ARN', // Replace with your AWS SNS topic ARN
        };

        sns.listSubscriptionsByTopic(listParams, (err, data) => {
            if (err) {
                console.error('Error listing subscriptions:', err);
                res.status(500).json({ error: 'Failed to retrieve subscriptions' });
            } else {
                const subscription = data.Subscriptions?.find(
                    (sub) => sub.Protocol === 'email' && sub.Endpoint === email
                );

                if (subscription) {
                    const subscriptionArn = subscription.SubscriptionArn;

                    if (subscriptionArn) {
                        // Unsubscribe email from SNS topic
                        const unsubscribeParams = {
                            SubscriptionArn: subscriptionArn,
                        };

                        sns.unsubscribe(unsubscribeParams, (unsubscribeErr) => {
                            if (unsubscribeErr) {
                                console.error('Error unsubscribing email:', unsubscribeErr);
                                res.status(500).json({ error: 'Failed to unsubscribe email' });
                            } else {
                                console.log('Unsubscription successful');
                                res.status(200).json({ message: 'Email unsubscribed successfully' });
                            }
                        });
                    } else {
                        res.status(404).json({ error: 'Invalid subscription ARN' });
                    }
                } else {
                    res.status(404).json({ error: 'Email subscription not found' });
                }
            }
        });
    }
}

export const send_sqs = async (message: string) => {
    const params = {
        MessageBody: message,
        QueueUrl: process.env.AWS_SQS_QUEUE || '',
    };
    try {
        await sqs.sendMessage(params).promise();
        console.log('SQS message sent successfully');
    } catch (error) {
        console.error('Error sending SQS message:', error);
        throw error;
    }
}

export const api_poll = (req: Request, res: Response) => {
    // Start the message polling process
    pollSQSMessages().catch((error: any) => {
        res.status(400);
        return res.json({ error });
    });
    res.status(200);
    return res.json({ msg: 'Messages polled!' });
}