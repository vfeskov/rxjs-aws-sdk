import * as SES from 'aws-sdk/clients/ses';
import { Observable as $ } from 'rxjs/Observable';
import { rxifyMultipleRequestMethods } from './util';

export function create(config: SES.ClientConfiguration) {
  const ses = new SES(config);
  return rxifyMultipleRequestMethods(ses, [
    'sendEmail'
  ]) as RxSESInstance;
}

export interface RxSESInstance {
  sendEmail(params: SES.SendEmailRequest): $<SES.SendEmailResponse>
}
