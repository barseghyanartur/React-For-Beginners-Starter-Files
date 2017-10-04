import React from 'react';

import AddFishForm from './AddFishForm';
import base from '../base';

class Inventory extends React.Component {
    constructor() {
        super();
        this.renderInventory = this.renderInventory.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.renderLogin = this.renderLogin.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.authHandler = this.authHandler.bind(this);
        this.logout = this.logout.bind(this);
        this.state = {
            uid: null,
            owner: null
        };
    }

    componentDidMount() {
        base.onAuth((user) => {
            if (user) {
                this.authHandler(null, { user })
            }
        });
    }

    handleChange(event, key) {
//        const fishes = {...this.props.fishes};
        const fish = this.props.fishes[key];
        console.log(fish);
        // take a copy of that fish and update it with the new data
        const updatedFish = {
            ...fish,
            [event.target.name]: event.target.value
        };
        console.log(event.target.name, event.target.value);
        this.props.updateFish(key, updatedFish);
    }

    renderInventory(key) {
        const fish = this.props.fishes[key];
        return (
            <div className="fish-edit" key={key}>
                <input value={fish.name}
                       name="name"
                       type="text"
                       placeholder="Fish Name"
                       onChange={(e) => this.handleChange(e, key)}/>
                <input value={fish.price}
                       name="price"
                       type="text"
                       placeholder="Fish Price"
                       onChange={(e) => this.handleChange(e, key)}/>
                <select value={fish.status}
                        name="status"
                        onChange={(e) => this.handleChange(e, key)}>
                    <option value="available">Fresh!</option>
                    <option value="unavailable">Sold Out!</option>
                </select>
                <textarea value={fish.desc}
                          name="desc"
                          placeholder="Fish Desc"
                          onChange={(e) => this.handleChange(e, key)}></textarea>
                <input value={fish.image}
                       name="image"
                       type="text"
                       placeholder="Fish Image"
                       onChange={(e) => this.handleChange(e, key)}/>
                <button onClick={(e) => this.props.removeFish(key)}>Remove Fish</button>
            </div>
        )
    }

    authenticate(provider) {
        console.log(`Trying to log in ${provider}`);
        base.authWithOAuthPopup(provider, this.authHandler);
    }

    logout() {
        base.unauth();
        this.setState({
            uid: null
        })
    }

    authHandler(err, authData) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(authData);

        // grab the store info
        const storeRef = base.database().ref(this.props.storeId);

        // query the firebase once for the store data
        storeRef.once('value', (snapshot) => {
            const data = snapshot.val() || {};

            // claim it as our own if there s no owner already
            if (!data.owner) {
                storeRef.set({
                    owner: authData.user.uid
                });
            }

            this.setState({
                uid: authData.user.uid,
                owner: data.owner || authData.user.uid
            });
        });
    }

    renderLogin() {
        return (
            <nav className="login">
                <h2>Inventory</h2>
                <p>Sign in to manage your store's inventory</p>
                <button className="github"
                        onClick={() => this.authenticate('github')}>Log In with Github</button>
                <button className="facebook"
                        onClick={() => this.authenticate('facebook')}>Log In with Facebook</button>
                <button className="twitter"
                        onClick={() => this.authenticate('twitter')}>Log In with Twitter</button>
            </nav>
        )
    }

    render() {
        const logout = <button onClick={this.logout}>Log Out!</button>

        // Check if they are not logged in at all
        if (!this.state.uid) {
            return (
                <div>{this.renderLogin()}</div>
            )
        }

        // Check if they are the owner of the current store
        if (this.state.uid !== this.state.owner) {
            return (
                <div>
                    <p>Sorry you aren't the owner of this store!</p>
                    {logout}
                </div>
            )
        }

        return (
            <div>
                <p>Inventory</p>
                {logout}
                {Object.keys(this.props.fishes).map(this.renderInventory)}

                <AddFishForm addFish={this.props.addFish}/>
                <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
            </div>
        )
    }
}


Inventory.propTypes = {
    removeFish: React.PropTypes.func.isRequired,
    loadSamples: React.PropTypes.func.isRequired,
    fishes: React.PropTypes.object.isRequired,
    updateFish: React.PropTypes.func.isRequired,
    addFish: React.PropTypes.func.isRequired,
    storeId: React.PropTypes.string.isRequired,
//    renderLogin: React.PropTypes.func.isRequired,
//    authenticate: React.PropTypes.func.isRequired,
//    authHandler: React.PropTypes.func.isRequired
};


export default Inventory;
