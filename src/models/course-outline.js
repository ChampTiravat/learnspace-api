import mongoose, { Schema } from 'mongoose'

/**
 * @name CourseOutlineSchema
 * @type Mongoose Schema
 * @desc Clasroom's course outline. Uses to track the learning progress of the clasroom
 * @prop { title } String : outline's title(might be the name of unit of study)
 * @prop { classroom } ObjectId : Classroom which the outline belongs to
 * @prop { isPassed } Boolean : Status to track wether the classroom has already learn about the particular unit
 * @prop { createdAt } Date : Date when this outline is created
 * @prop { updatedAt } Date : Lasted date when the information of the outline has been updated
 */
const CourseOutlineSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  passed: {
    type: Boolean,
    default: false,
    required: true
  },
  classroom: {
    type: Schema.Types.ObjectId,
    ref: 'Classroom',
    required: true
  },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() }
})

mongoose.model('course-outline', CourseOutlineSchema)
