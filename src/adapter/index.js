const { Resource: SequelizeResource } = require('admin-bro-sequelizejs')
const { BaseRecord } = require('admin-bro')
const { Op } = require('sequelize')
const keyBy = require('lodash/keyby');


class Resource extends SequelizeResource {

  sortField() {
    const decorated = this.decorate()
    return decorated.options && decorated.options.sort && decorated.options.sort.sortBy ? decorated.options.sort.sortBy : this.titleField()
  }

  titleField() {
    return this.decorate().titleProperty().name()
  }

  wrapObject(obj) {
    return new BaseRecord(obj.toJSON(), this)
  }

  wrapObjects(sequelizeObjects) {
    return sequelizeObjects.map(sequelizeObject => this.wrapObject(sequelizeObject))
  }

  associationFor(toResourceId) {
    const associations = this.getAssociationsByResourceId(toResourceId)
    return keyBy(associations, v => v.as)
  }

  async findRelated(record, association, options = {}) {
    const instance = this.getInstance(record)
    return await instance[association.accessors.get](options)
  }

  async deleteMissingRecords(relatedField, id, ids) {
    return this.SequelizeModel.destroy({
      where: {
        [Op.and]: [
          {
            [relatedField]: id
          },
          {
            [this.primaryKeyField()]: {
              [Op.notIn]: ids,
            }
          }
        ]
      }
    })
  }

  getAssociationsByResourceId(resourceId) {
    return Object.values(this.SequelizeModel.associations).filter(association => association.target.tableName === resourceId)
  }

  getAssociationsByAlias(alias) {
    return Object.values(this.SequelizeModel.associations).filter(association => association.as === alias)
  }

  getInstance(record) {
     return new this.SequelizeModel(record.params, {isNewRecord: false})
  }

  async saveRecords(record, association, ids) {
    const instance = this.getInstance(record)
    await association.set(instance, ids)
  }

  primaryKeyField() {
    return this.SequelizeModel.primaryKeyField
  }

  getPropertiesOfType(where, type) {
    return this.decorate().getProperties({where: where}).filter(p => p.type() === type)
  }

  getManyProperties() {
    return this.getPropertiesOfType('edit', 'many')
  }

  getSelectProperties() {
    return this.getPropertiesOfType('edit', 'select')
  }

  getInlineProperties() {
    return this.getPropertiesOfType('edit', 'inline')
  }

  getOneProperties() {
    return this.getPropertiesOfType('edit', 'one')
  }
}

export { Resource }
