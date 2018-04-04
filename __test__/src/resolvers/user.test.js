import request from 'superagent'

import { TEST_URL } from '../../test-config'
import User from '../../../src/models/user'

describe('Testing User Resolver', async () => {
  beforeEach(() => {
    return Promise.resolve(User.remove({}))
  })

  it('User Registration', async done => {
    const response = await request.post(TEST_URL).send({
      query: `
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
						      message
					      }
			        }
		        }
      `
    })

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

    expect(JSON.parse(response.text)).toMatchObject(expectedResult)
    done()
  })
})
