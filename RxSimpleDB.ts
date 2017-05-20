import * as SimpleDB from 'aws-sdk/clients/simpledb';
import { Observable as $ } from 'rxjs/Observable';
const { assign } = Object;

export function create(config: SimpleDB.ClientConfiguration) {
  const origSimpledb = new SimpleDB(config);
  return ['getAttributes', 'putAttributes', 'select']
    .reduce((result, method) =>
      assign(result, {
        [method]: params => rxifySimpleDBMethod(origSimpledb, method, params)
      }),
      {}
    ) as RxSimpleDBInstance;
}

export function flattenAttrs(attrs: SimpleDB.Attribute[]) {
  return attrs.reduce((res, attr) =>
    assign(res, {[attr.Name]: attr.Value}),
  {} as any);
}

function rxifySimpleDBMethod(origSimpledb, methodName, params) {
  return new $(subscriber => {
    const request = origSimpledb[methodName](params, (err, data) => {
      if (err) { return subscriber.error(err); }
      subscriber.next(data);
      subscriber.complete();
    });
    return () => request.abort();
  });
}

export interface RxSimpleDBInstance {
  getAttributes(params?: SimpleDB.Types.GetAttributesRequest): $<SimpleDB.GetAttributesResult>;
  putAttributes(params?: SimpleDB.Types.PutAttributesRequest): $<{}>;
  select(params?: SimpleDB.Types.SelectRequest): $<SimpleDB.Types.SelectResult>;
}
