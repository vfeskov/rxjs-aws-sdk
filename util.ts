import { Observable as $ } from 'rxjs/Observable';
const { assign } = Object;

export function rxifyMultipleRequestMethods(service, methods) {
  return methods
    .reduce((result, method) =>
      assign(result, {
        [method]: params => rxifyRequestMethod(service, method, params)
      }),
      {}
    );
}

export function rxifyRequestMethod(service, methodName, params) {
  return new $(subscriber => {
    const request = service[methodName](params, (err, data) => {
      if (err) { return subscriber.error(err); }
      subscriber.next(data);
      subscriber.complete();
    });
    return () => request.abort();
  });
}
