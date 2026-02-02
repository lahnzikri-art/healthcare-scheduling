import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private mailerService: MailerService) {}

  async sendScheduleCreated(
    customerEmail: string,
    customerName: string,
    scheduleData: {
      objective: string;
      doctorName: string;
      scheduledAt: Date;
    },
  ) {
    try {
      await this.mailerService.sendMail({
        to: customerEmail,
        subject: 'Schedule Confirmation - Healthcare Scheduling',
        template: './schedule-created',
        context: {
          customerName,
          objective: scheduleData.objective,
          doctorName: scheduleData.doctorName,
          scheduledAt: scheduleData.scheduledAt.toLocaleString('en-US', {
            dateStyle: 'full',
            timeStyle: 'short',
          }),
        },
      });
      this.logger.log(`Schedule created email sent to ${customerEmail}`);
    } catch (error) {
      this.logger.error(
        `Failed to send schedule created email to ${customerEmail}`,
        error.stack,
      );
    }
  }

  async sendScheduleDeleted(
    customerEmail: string,
    customerName: string,
    scheduleData: {
      objective: string;
      doctorName: string;
      scheduledAt: Date;
    },
  ) {
    try {
      await this.mailerService.sendMail({
        to: customerEmail,
        subject: 'Schedule Cancellation - Healthcare Scheduling',
        template: './schedule-deleted',
        context: {
          customerName,
          objective: scheduleData.objective,
          doctorName: scheduleData.doctorName,
          scheduledAt: scheduleData.scheduledAt.toLocaleString('en-US', {
            dateStyle: 'full',
            timeStyle: 'short',
          }),
        },
      });
      this.logger.log(`Schedule deleted email sent to ${customerEmail}`);
    } catch (error) {
      this.logger.error(
        `Failed to send schedule deleted email to ${customerEmail}`,
        error.stack,
      );
    }
  }
}
