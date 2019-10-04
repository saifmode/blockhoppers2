		// Keep the selector block within the home bounds of the selected block.
		// Skip these if you want to drag the block anywhere, e.g. during level editing.

		if (this.x > this.homeX + config.board.spacing) {
			this.x = this.homeX + config.board.spacing;
		} else if (this.x < this.homeX - config.board.spacing) {
			this.x = this.homeX - config.board.spacing;
		}

		if (this.y > this.homeY + config.board.spacing) {
			this.y = this.homeY + config.board.spacing;
		} else if (this.y < this.homeY - config.board.spacing) {
			this.y = this.homeY - config.board.spacing;
		}

		// Make visible if user is dragging the block around