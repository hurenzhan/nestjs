import { SelectQueryBuilder } from 'typeorm';
import * as _ from 'lodash';

export const conditionUtil_CO = <T>(
    queryBuilder: SelectQueryBuilder<T>,
    obj: Record<string, unknown>,
) => {
    _.forEach(obj, (value, key) => {
        if (!_.isNil(value))
            queryBuilder.andWhere(`${key}=:${key}`, { [key]: value });
    });

    return queryBuilder;
};
