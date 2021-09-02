const {Client}= require('pg');

const client = new Client('postgres://postgres@localhost:5432/juicebox-dev')




async function getAllUsers(){
    const { rows } = await client.query(
        `SELECT id, username, name, location, active
        FROM users;              
      `)
      return rows
}

async function createUser({ 
    username, 
    password,
    name,
    location }) {
    try {
      const { rows: [user] } = await client.query(`
        INSERT INTO users(username, password, name, location) 
        VALUES($1, $2, $3, $4) 
        ON CONFLICT (username) DO NOTHING 
        RETURNING *;
      `, [username, password, name, location]);
  
      return user;
    } catch (error) {
      throw error;
    }
  }

  async function updateUser(id, fields = {}) {
    // build the set string
    const setString = Object.keys(fields).map(
      (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');
  
    // return early if this is called without fields
    if (setString.length === 0) {
      return;
    }
  
    try {
      const { rows: [user]} = await client.query(`
        UPDATE users
        SET ${ setString }
        WHERE id=${ id }
        RETURNING *;
      `, Object.values(fields));
  
      return user;
    } catch (error) {
      throw error;
    }
  }

  async function createPosts({
    authorId,
    title,
    content
  }){
    try{
      await client.query(`
      CREATE TABLE posts(   
      id SERIAL PRIMARY KEY
      "authorId" INTEGER REFERENCES users(id) NOT NULL
      title VARCHAR(255) NOT NULL
      content TEXT NOT NULL
      active BOOLEAN DEFAULT true
   `)
   console.log("CREATED POSTS!");
  } catch (error) {
    console.error("Error creating Posts");
    throw error;
  }
  }

  async function updatePost(id, fields = {}) {
    
    // build the set string
    const setString = Object.keys(fields).map(
      (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');
  
    // return early if this is called without fields
    if (setString.length === 0) {
      return;
    }
  
    try {
      const { rows: [post]} = await client.query(`
        UPDATE post
        SET ${ setString }
        WHERE id=${ id }
        RETURNING *;
      `, Object.values(fields));
  
      return post;
    } catch (error) {
      throw error;
    }
  }

module.exports = {
    client,
    getAllUsers,
    createUser,
    updateUser,
    createPosts,
    updatePost
}