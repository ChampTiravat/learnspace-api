import request from 'superagent'

import { TEST_URL } from '../../test-config'

describe('Testing User Resolvers', () => {
  test('User Registration Resolver with correct specifications', () => {
    const query = `
    mutation {
			register(
				email: "tiravat2016@gmail.com",
				username: "tiravat2016",
				fname: "tiravat",
				lname: "thaisubvorakul",
				password: "123456789"
			) {
				success
				user {
				  email
				  username
				  fname
					lname
				}
				err {
          name
				  message
				}
			}
	  }
  `
    const expectedResult = {
      data: {
        register: {
          success: true,
          user: {
            email: 'tiravat2016@gmail.com',
            username: 'tiravat2016',
            fname: 'tiravat',
            lname: 'thaisubvorakul'
          },
          err: null
        }
      }
    }

    return request
      .post(TEST_URL)
      .send({ query })
      .then(response => {
        const actualResult = JSON.parse(response.text)
        return expect(actualResult).toMatchObject(expectedResult)
      })
  })
})
