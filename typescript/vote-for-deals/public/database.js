export class Database {
  constructor(json) {
    this.initialize(json)
    /**
     * 
     * @param {string} str
     * @returns string
     */
     this.regExReplace = str => str.replace(/\"|\,/g, '')
     this.clone = data => JSON.parse(JSON.stringify(data))
     this.send = data => feature_box.pubsub.emit(this.VOTES_AVAILABLE, data)
     this.configs = this.configStr
     .map(this.str2Obj.bind(this))
     .map(this.configObj.bind(this))
     .map(this.firestore.bind(this))

     json.fbox.pubsub.subscribe("load data", this.load.bind(this))
     json.fbox.pubsub.subscribe("submit", this.submit.bind(this))
  }

  initialize(json) {
    this.json = json
    this.configStr = ["projectId==jumia-vote-deals|messagingSenderId==15013363201|apiKey==AIzaSyC8htXCQ-5Tm_qCKgbVBQaS_Enu5zQmIeU|appId==1:15013363201:web:d8ed9ec2a4f2f331d50a00",]
    this.db_idx = 0
  }

  str2Obj(str) {
    const replaced = this.regExReplace(str)
    const props = replaced.split("|")
    return props.reduce(this.reducer.bind(this), {})
  }

  reducer(arr, prop) {
    const keyVal = prop.split("==")
    const key = keyVal[0]
    arr[key] = keyVal[1] ? keyVal[1].toLocaleString() : keyVal[1]
    return arr
  }

  configObj(json) {
    let cloned = this.clone(json)
    const authDomain = json.projectId + ".firebaseapp.com"
    const databaseURL = "https://" + json.projectId + ".firebaseio.com"
    const storageBucket = json.projectId + ".appspot.com"
    const obj = { authDomain, databaseURL, storageBucket }
    return { ...cloned, ...obj }
  }

  firestore(json) {
    let app = firebase.initializeApp(json, json.projectId)
    let auth = app.auth();

    auth.onAuthStateChanged((user) => {
      this.user = user
      this.signIn(auth)
    })

    let appJSON = { firestore: app.firestore() }
    return { ...json, ...appJSON }
  }

  
  signIn(auth) {
    console.log("signing in")
    auth
      .signInWithEmailAndPassword(this.json.email, this.json.password)
      .then((user) => this.load(this.FROM_INITIALIZE))
      .catch((err) => {
        if (err.code === "auth/user-not-found") this.signUp(auth);
      });
  }

  signUp(auth) {
    console.log("signing up")
    auth
      .createUserWithEmailAndPassword(this.json.email, this.json.password)
      .then((user) => {
        console.log("account created") 
      }).catch((err) => console.log(err));
  }

  load(from) {
    const dbIdx = this.dbIdx(from)
    const dbConfig = this.configs[dbIdx]

    this.get(dbConfig.firestore, this.ID)
    .then(this.onSuccess.bind(this))
    .catch(this.onError.bind(this))
  }

  onSuccess(data) {
    console.info("successfully retrieved data")
    this.jsonToLStorage(this.VOTED_DEALS, data)
    this.send(data)
  }

  onError(err) {
    console.info("error fetching data", err.message)
    const data = this.jsonFrLStorage(this.VOTED_DEALS, {})
    this.send(data)
  }

  dbIdx(from) {
    if (from === this.FROM_INTERVAL) {
      this.db_idx++
      return this.db_idx >= this.configs.length ? 0 : this.db_idx
    }
    return this.db_idx
  }

  submit(data) {
    console.log("user is", this.user)
    if (this.user) {
      this.configs.map(config => {
        this.save(config.firestore, data)
        .then(() => console.log("successfully saved in", config.projectId))
        .catch(err => console.error("error submitting document", err))
      })
    } else {
      console.log("you need to be signed in to store data")
    }
  }

  save(firestore, data) {
    return firestore.collection(this.ID).doc("data")
    .set(data, { merge: true })
  }

  get(firestore, collection) {
    return firestore.collection(collection).doc("data")
    .get().then(doc => doc.exists ? doc.data() : {})
    .catch(err => console.error(err))
  }
}