import axios from 'axios'

import User from '../../../src/models/user'
const TEST_URL = 'http://localhost:5000/graphql'

beforeEach(() => {
	return Promise.resolve(User.remove({}))
})

describe('Testing User Resolver', () => {
	test('User Registration', async () => {
		const response = await axios.post(TEST_URL, {
			query: `
        mutation {
          register(
            email: "bw@marvel.com",
            password: "this is a very secure password",
            fname: "Scarlett",
            lname: "Johanson"
          ) {
            success
            err
            user {
              fname
              lname
              email
            }
          }
        }
      `
		})
		const expectResult = {
			data: {
				register: {
					success: true,
					err: null,
					user: {
						fname: 'Scarlett',
						lname: 'Johanson',
						email: 'bw@marvel.com'
					}
				}
			}
		}

		expect(response.data).toMatchObject(expectResult)
	})

	test('User Login', async () => {
		const response = await axios.post(TEST_URL, {
			query: `
        mutation {
          login(email: "bw@marvel.com", password: "this is a very secure password") {
            success

            user {
              fname
              lname
              email
            }
            err
          }
        }
      `
		})

		const expectResult = {
			data: {
				login: {
					success: true,
					// token:
					// 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJ3QG1hcnZlbC5jb20iLCJpYXQiOjE1MTU2MDEzMzgsImV4cCI6MTUxNTYwODUzOH0.iWfRTW7BQ27ozOXP9AZTsw_MFTIYneK8mrUcaF1Fcn8',
					user: {
						fname: 'Scarlett',
						lname: 'Johanson',
						email: 'bw@marvel.com'
					},
					err: ''
				}
			}
		}

		expect(response.data).toMatchObject(expectResult)
	})
})
