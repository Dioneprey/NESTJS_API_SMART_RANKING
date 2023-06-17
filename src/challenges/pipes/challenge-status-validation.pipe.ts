import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ChallengeStatus } from '../interfaces/challenge-status.enum';

export class ChallengeStatusValidationPipe implements PipeTransform {
  readonly allowedStatus = [
    ChallengeStatus.ACCEPTED,
    ChallengeStatus.DENIED,
    ChallengeStatus.CANCELED,
  ];

  transform(value: any) {
    const status = value.status.toUpperCase();

    if (!this.isStatusValid(status)) {
      throw new BadRequestException(
        `${status} is not a valid challenge status`,
      );
    }

    return value;
  }

  private isStatusValid(status: any) {
    const idx = this.allowedStatus.indexOf(status);
    // -1 if element is not found
    return idx !== -1;
  }
}
