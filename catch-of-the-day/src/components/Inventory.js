import React from 'react';

import AddFishForm from './AddFishForm';


class Inventory extends React.Component {
    constructor() {
        super();
        this.renderInventory = this.renderInventory.bind(this);
        this.handleChange = this.handleChange.bind(this);
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

    render() {
        return (
            <div>
                <p>Inventory</p>
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
    addFish: React.PropTypes.func.isRequired
};


export default Inventory;
