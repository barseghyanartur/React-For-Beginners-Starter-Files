import React from 'react';
import { render } from 'react-dom';

import { getFunName } from '../helpers';

class StorePicker extends React.Component {
//    constructor() {
//        super();
//        this.goToStore = this.goToStore.bind(this);
//    }

    goToStore(event) {
        event.preventDefault();
        console.log("You changed the URL");
        console.log(this.storeInput.value);
        // First grab the text from the box
        // second we're going to transition /to /store:storeId
    }

    render() {
        return (
            <form className="store-selector" onSubmit={(e) => this.goToStore(e)}>
                <h2>Please Enter A Store</h2>
                <input type="text" required placeholder="Store Name"
                       defaultValue={getFunName()}
                       ref={(input) => { this.storeInput = input }}/>
                <button type="submit">Visit Store -></button>
            </form>
        )
    }
}

export default StorePicker;
