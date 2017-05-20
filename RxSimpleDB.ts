import * as SimpleDB from 'aws-sdk/clients/simpledb';
import { Observable as $ } from 'rxjs/Observable';
import { rxifyMultipleRequestMethods } from './util';
const { assign } = Object;

export function create(config: SimpleDB.ClientConfiguration) {
  const simpleDB = new SimpleDB(config);
  return rxifyMultipleRequestMethods(simpleDB, [
    'getAttributes',
    'putAttributes',
    'select'
  ]) as RxSimpleDBInstance;
}

export function flattenAttrs(attrs: SimpleDB.Attribute[]) {
  return attrs.reduce((res, attr) =>
    assign(res, {[attr.Name]: attr.Value}),
  {} as any);
}

export interface RxSimpleDBInstance {
  getAttributes(params?: SimpleDB.Types.GetAttributesRequest): $<SimpleDB.GetAttributesResult>;
  putAttributes(params?: SimpleDB.Types.PutAttributesRequest): $<{}>;
  select(params?: SimpleDB.Types.SelectRequest): $<SimpleDB.Types.SelectResult>;
}
