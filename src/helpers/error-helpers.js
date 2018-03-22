/**
 * @name displayErrMessageWhenDev()
 * @desc Display an error only in development environment
 * @param err : Eror object from try/catch block
 * @return None
 */
export const displayErrMessageWhenDev = err => {
  if (process.env.NODE_ENV === 'development') {
    if (!err) throw new Error('displayErrMessageWhenDev: Invalid Argument!')
    console.log(err)
  }
}
