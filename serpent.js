var Serpent;
(function (Serpent) {
    var TimeSpan = (function () {
        function TimeSpan(hours, minutes, seconds, milliseconds) {
            this.set(hours, minutes, seconds, milliseconds);
        }
        TimeSpan.prototype.set = function (hours, minutes, seconds, milliseconds) {
            var ms = this.convertToMs(hours, minutes, seconds, milliseconds);
            if (ms < 0) {
                throw new RangeError('TimeSpan cannot be negative!');
            }
            this.ms = ms;
        };
        TimeSpan.prototype.add = function (hours, minutes, seconds, milliseconds) {
            var ms = this.convertToMs(hours, minutes, seconds, milliseconds);
            if (ms + this.ms < 0) {
                throw new RangeError('TimeSpan cannot be negative!');
            }
            this.ms += ms;
        };
        TimeSpan.prototype.subtract = function (hours, minutes, seconds, milliseconds) {
            var ms = this.convertToMs(hours, minutes, seconds, milliseconds);
            if (ms - this.ms < 0) {
                throw new RangeError('TimeSpan cannot be negative!');
            }
            this.ms -= ms;
        };
        TimeSpan.prototype.toHours = function () {
            return this.ms / 3600000;
        };
        TimeSpan.prototype.toMinutes = function () {
            return this.ms / 60000;
        };
        TimeSpan.prototype.toSeconds = function () {
            return this.ms / 1000;
        };
        TimeSpan.prototype.toMilliseconds = function () {
            return this.ms;
        };
        TimeSpan.prototype.convertToMs = function (hours, minutes, seconds, milliseconds) {
            if (hours === void 0) { hours = 0; }
            if (minutes === void 0) { minutes = 0; }
            if (seconds === void 0) { seconds = 0; }
            if (milliseconds === void 0) { milliseconds = 0; }
            return (hours * 3600000) + (minutes * 60000) + (seconds * 1000) + (milliseconds);
        };
        return TimeSpan;
    })();
    Serpent.TimeSpan = TimeSpan;
})(Serpent || (Serpent = {}));

/// <reference path="./TimeSpan.ts" />
var Serpent;
(function (Serpent) {
    var LoopingAction = (function () {
        function LoopingAction(timeSpan, action) {
            this.timeSpan = timeSpan;
            this.action = action;
        }
        LoopingAction.prototype.toggle = function () {
            if (this.isResumed()) {
                this.suspend();
            }
            else {
                this.resume();
            }
        };
        LoopingAction.prototype.isResumed = function () {
            return this.id ? true : false;
        };
        LoopingAction.prototype.isSuspended = function () {
            return !this.isResumed();
        };
        return LoopingAction;
    })();
    Serpent.LoopingAction = LoopingAction;
})(Serpent || (Serpent = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="./TimeSpan.ts" />
/// <reference path="./LoopingAction.ts" />
var Serpent;
(function (Serpent) {
    var RecursiveTimeout = (function (_super) {
        __extends(RecursiveTimeout, _super);
        function RecursiveTimeout(timeSpan, action, context) {
            var _this = this;
            if (context) {
                action = action.bind(context);
            }
            _super.call(this, timeSpan, action);
            this.action = function () {
                action();
                if (_this.id) {
                    _this.id = _this.setLoop(_this.action);
                }
            };
        }
        RecursiveTimeout.prototype.resume = function () {
            if (!this.id) {
                this.id = this.setLoop(this.action);
            }
        };
        RecursiveTimeout.prototype.suspend = function () {
            if (this.id) {
                this.clearLoop(this.id);
                this.id = null;
            }
        };
        RecursiveTimeout.prototype.setLoop = function (action) {
            return setTimeout(action, this.timeSpan.toMilliseconds());
        };
        RecursiveTimeout.prototype.clearLoop = function (id) {
            clearTimeout(id);
        };
        return RecursiveTimeout;
    })(Serpent.LoopingAction);
    Serpent.RecursiveTimeout = RecursiveTimeout;
})(Serpent || (Serpent = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="./RecursiveTimeout.ts" />
/// <reference path="./TimeSpan.ts" />
var Serpent;
(function (Serpent) {
    var Animation = (function (_super) {
        __extends(Animation, _super);
        function Animation(action, context) {
            _super.call(this, new Serpent.TimeSpan(0, 0, 0, 1000 / 60), action, context);
            if (requestAnimationFrame) {
                this.setAnimation = requestAnimationFrame;
                this.clearAnimation = cancelAnimationFrame;
            }
            else {
                this.setAnimation = _super.prototype.setLoop;
                this.clearAnimation = _super.prototype.clearLoop;
            }
        }
        Animation.prototype.setLoop = function (action) {
            return this.setAnimation(action);
        };
        Animation.prototype.clearLoop = function (id) {
            this.clearAnimation(id);
        };
        return Animation;
    })(Serpent.RecursiveTimeout);
    Serpent.Animation = Animation;
})(Serpent || (Serpent = {}));

var Serpent;
(function (Serpent) {
    var Disctionary = (function () {
        function Disctionary() {
        }
        return Disctionary;
    })();
    Serpent.Disctionary = Disctionary;
})(Serpent || (Serpent = {}));

var Serpent;
(function (Serpent) {
    (function (Direction) {
        Direction[Direction["Down"] = 0] = "Down";
        Direction[Direction["Left"] = 1] = "Left";
        Direction[Direction["Right"] = 2] = "Right";
        Direction[Direction["Up"] = 3] = "Up";
    })(Serpent.Direction || (Serpent.Direction = {}));
    var Direction = Serpent.Direction;
})(Serpent || (Serpent = {}));

var Serpent;
(function (Serpent) {
    var Point = (function () {
        function Point(x, y) {
            this.moveTo(x, y);
        }
        Point.prototype.moveBy = function (x, y) {
            this.x += x;
            this.y += y;
            return this;
        };
        Point.prototype.moveTo = function (x, y) {
            this.x = x;
            this.y = y;
            return this;
        };
        Point.prototype.moveToPoint = function (point) {
            return this.moveTo(point.x, point.y);
        };
        Point.default = function () {
            return new Point(0, 0);
        };
        return Point;
    })();
    Serpent.Point = Point;
})(Serpent || (Serpent = {}));

var Serpent;
(function (Serpent) {
    var Size = (function () {
        function Size(width, height) {
            this.resizeTo(width, height);
        }
        Size.prototype.resizeBy = function (width, height) {
            this.width += width;
            this.height += height;
            return this;
        };
        Size.prototype.resizeTo = function (width, height) {
            this.width = width;
            this.height = height;
            return this;
        };
        Size.default = function () {
            return new Size(0, 0);
        };
        return Size;
    })();
    Serpent.Size = Size;
})(Serpent || (Serpent = {}));



/// <reference path="./IStageDefaultConfig.ts" />
/// <reference path="./IActor.ts" />

/// <reference path="./Stage.ts" />
/// <reference path="./IStageConfig.ts" />
/// <reference path="./IStageDefaultConfig.ts" />
var Serpent;
(function (Serpent) {
    var Broadway;
    (function (Broadway) {
        var StageDefault = (function () {
            function StageDefault(parent, config) {
                this.parent = parent;
                this.backgroundColor = config.backgroundColor;
                this.foregroundColor = config.foregroundColor;
                this.fontStyle = config.fontStyle;
                this.fillStyle = config.fillStyle(parent.renderContext());
            }
            StageDefault.prototype.reset = function () {
                this.parent.renderCanvas().style.backgroundColor = this.backgroundColor;
                this.parent.renderContext().strokeStyle = this.foregroundColor;
                this.parent.renderContext().font = this.fontStyle;
                this.parent.renderContext().fillStyle = this.fillStyle;
            };
            return StageDefault;
        })();
        Broadway.StageDefault = StageDefault;
    })(Broadway = Serpent.Broadway || (Serpent.Broadway = {}));
})(Serpent || (Serpent = {}));

/// <reference path="./StageDefault.ts" />
/// <reference path="../Animation.ts" />
/// <reference path="../TimeSpan.ts" />
/// <reference path="../LoopingAction.ts" />
/// <reference path="./IStageConfig.ts" />
/// <reference path="./IStageDefaultConfig.ts" />
var Serpent;
(function (Serpent) {
    var Broadway;
    (function (Broadway) {
        var Stage = (function () {
            function Stage(config) {
                var _this = this;
                this.animation = new Serpent.Animation(this.moment, this);
                this.default = new Broadway.StageDefault(this, config.default);
                this.actors = new Array();
                this.canvas = config.canvas;
                this.context = this.canvas.getContext('2d');
                if (config.actors) {
                    this.actors = this.actors.concat(config.actors(this));
                }
                this.actors.forEach(function (a) { return a.stage = _this; });
                this.default.reset();
                this.actors.forEach(function (a) { return a.render(); });
            }
            Stage.prototype.renderContext = function () {
                return this.context;
            };
            Stage.prototype.renderCanvas = function () {
                return this.canvas;
            };
            Stage.prototype.left = function () {
                return 0;
            };
            Stage.prototype.right = function () {
                return this.canvas.width;
            };
            Stage.prototype.top = function () {
                return 0;
            };
            Stage.prototype.bottom = function () {
                return this.canvas.height;
            };
            Stage.prototype.moment = function () {
                this.clear();
                this.actors.forEach(function (actor) {
                    actor.update();
                    actor.render();
                });
            };
            Stage.prototype.clear = function () {
                this.renderContext().clearRect(0, 0, this.canvas.width, this.canvas.height);
            };
            return Stage;
        })();
        Broadway.Stage = Stage;
    })(Broadway = Serpent.Broadway || (Serpent.Broadway = {}));
})(Serpent || (Serpent = {}));

/// <reference path="../Point.ts" />
/// <reference path="../Size.ts" />
/// <reference path="./Stage.ts" />

var Serpent;
(function (Serpent) {
    var Helper;
    (function (Helper) {
        var Extension = (function () {
            function Extension() {
            }
            Extension.random = function (arr) {
                return arr[Math.floor(Math.random() * arr.length)];
            };
            Extension.randomNumber = function (max) {
                return Math.floor(Math.random() * max) + 1;
            };
            Extension.first = function (arr) {
                return arr[0];
            };
            Extension.second = function (arr) {
                return arr[1];
            };
            Extension.last = function (arr) {
                return arr[arr.length - 1];
            };
            return Extension;
        })();
        Helper.Extension = Extension;
    })(Helper = Serpent.Helper || (Serpent.Helper = {}));
})(Serpent || (Serpent = {}));

/// <reference path="../Broadway/IStageConfig.ts" />
/// <reference path="../Broadway/IStageDefaultConfig.ts" />
/// <reference path="../Broadway/IActor.ts" />

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../Size.ts" />
/// <reference path="../Broadway/Stage.ts" />
/// <reference path="../Broadway/IActor.ts" />
/// <reference path="./ITilesetConfig.ts" />
/// <reference path="../Helper/Extension.ts" />
var Serpent;
(function (Serpent) {
    var Engine;
    (function (Engine) {
        var Tileset = (function (_super) {
            __extends(Tileset, _super);
            function Tileset(config) {
                this.rowCount = config.rowCount;
                this.columnCount = config.columnCount;
                _super.call(this, config);
                this.animation = new Serpent.RecursiveTimeout(new Serpent.TimeSpan(0, 0, 0, 1000 / config.frameRate), this.moment, this);
                this.resizeCanvasToTileset();
                this.actors.forEach(function (a) { return a.render(); });
            }
            Tileset.prototype.resizeCanvasToTileset = function () {
                var canvas = this.renderCanvas(), width = this.tileWidth(), height = this.tileHeight();
                while (canvas.width % width != 0) {
                    canvas.width--;
                }
                while (canvas.height % height != 0) {
                    canvas.height--;
                }
            };
            Tileset.prototype.tileWidth = function () {
                return Math.floor(this.renderCanvas().width / this.columnCount);
            };
            Tileset.prototype.tileHeight = function () {
                return Math.floor(this.renderCanvas().height / this.rowCount);
            };
            Tileset.prototype.tileSize = function () {
                return new Serpent.Size(this.tileWidth(), this.tileHeight());
            };
            Tileset.prototype.randomTilePosition = function () {
                return new Serpent.Point(Serpent.Helper.Extension.randomNumber(this.columnCount - 1) * this.tileWidth(), Serpent.Helper.Extension.randomNumber(this.rowCount - 1) * this.tileHeight());
            };
            return Tileset;
        })(Serpent.Broadway.Stage);
        Engine.Tileset = Tileset;
    })(Engine = Serpent.Engine || (Serpent.Engine = {}));
})(Serpent || (Serpent = {}));

/// <reference path="../../Point.ts" />
/// <reference path="../../Size.ts" />
/// <reference path="../Stage.ts" />
/// <reference path="../IActor.ts" />
var Serpent;
(function (Serpent) {
    var Broadway;
    (function (Broadway) {
        var Actor;
        (function (Actor) {
            var Shape = (function () {
                function Shape(stage) {
                    this.stage = stage;
                    this.size = Serpent.Size.default();
                    this.position = Serpent.Point.default();
                }
                Shape.prototype.left = function () {
                    return this.position.x;
                };
                Shape.prototype.right = function () {
                    return this.position.x + this.size.width;
                };
                Shape.prototype.top = function () {
                    return this.position.y;
                };
                Shape.prototype.bottom = function () {
                    return this.position.y + this.size.height;
                };
                Shape.prototype.hasHitRightBound = function () {
                    return this.right() >= this.renderCanvas().width;
                };
                Shape.prototype.hasHitLeftBound = function () {
                    return this.left() <= 0;
                };
                Shape.prototype.hasHitBottomBound = function () {
                    return this.bottom() >= this.renderCanvas().height;
                };
                Shape.prototype.hasHitTopBound = function () {
                    return this.top() <= 0;
                };
                Shape.prototype.hasHitAnyBound = function () {
                    return this.hasHitTopBound() ||
                        this.hasHitBottomBound() ||
                        this.hasHitLeftBound() ||
                        this.hasHitRightBound();
                };
                Shape.prototype.hasPassedRightBound = function () {
                    return this.right() > this.renderCanvas().width;
                };
                Shape.prototype.hasPassedLeftBound = function () {
                    return this.left() < 0;
                };
                Shape.prototype.hasPassedBottomBound = function () {
                    return this.bottom() > this.renderCanvas().height;
                };
                Shape.prototype.hasPassedTopBound = function () {
                    return this.top() < 0;
                };
                Shape.prototype.hasPassedAnyBound = function () {
                    return this.hasPassedTopBound() ||
                        this.hasPassedBottomBound() ||
                        this.hasPassedLeftBound() ||
                        this.hasPassedRightBound();
                };
                Shape.prototype.hasHit = function (otherShape) {
                    return !(this.bottom() <= otherShape.top() ||
                        this.top() >= otherShape.bottom() ||
                        this.right() <= otherShape.left() ||
                        this.left() >= otherShape.right());
                };
                Shape.prototype.hasCollidedWith = function (otherShape) {
                    return !(this.bottom() < otherShape.top() ||
                        this.top() > otherShape.bottom() ||
                        this.right() < otherShape.left() ||
                        this.left() > otherShape.right());
                };
                Shape.prototype.render = function () {
                    this.beginRender();
                    this.renderContent();
                    this.endRender();
                };
                Shape.prototype.update = function () {
                    this.updateContent();
                };
                Shape.prototype.renderContext = function () {
                    return this.stage.renderContext();
                };
                Shape.prototype.renderCanvas = function () {
                    return this.stage.renderCanvas();
                };
                Shape.prototype.beginRender = function () {
                    this.renderContext().save();
                    this.renderContext().beginPath();
                };
                Shape.prototype.endRender = function () {
                    this.renderContext().stroke();
                    this.renderContext().fill();
                    this.renderContext().closePath();
                    this.renderContext().restore();
                };
                return Shape;
            })();
            Actor.Shape = Shape;
        })(Actor = Broadway.Actor || (Broadway.Actor = {}));
    })(Broadway = Serpent.Broadway || (Serpent.Broadway = {}));
})(Serpent || (Serpent = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="./Tileset.ts" />
/// <reference path="../Broadway/Actor/Shape.ts" />
var Serpent;
(function (Serpent) {
    var Engine;
    (function (Engine) {
        var TileShape = (function (_super) {
            __extends(TileShape, _super);
            function TileShape(tileset) {
                _super.call(this, tileset);
                this.tileset = tileset;
                this.size = tileset.tileSize();
            }
            TileShape.prototype.hasCollidedWith = function (otherTileShape) {
                return this.position.x == otherTileShape.position.x &&
                    this.position.y == otherTileShape.position.y;
            };
            return TileShape;
        })(Serpent.Broadway.Actor.Shape);
        Engine.TileShape = TileShape;
    })(Engine = Serpent.Engine || (Serpent.Engine = {}));
})(Serpent || (Serpent = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="./Tileset.ts" />
/// <reference path="./TileShape.ts" />
var Serpent;
(function (Serpent) {
    var Engine;
    (function (Engine) {
        var Pixel = (function (_super) {
            __extends(Pixel, _super);
            function Pixel() {
                _super.apply(this, arguments);
            }
            Pixel.prototype.renderContent = function () {
                this.renderContext().fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
            };
            Pixel.prototype.updateContent = function () { };
            return Pixel;
        })(Engine.TileShape);
        Engine.Pixel = Pixel;
    })(Engine = Serpent.Engine || (Serpent.Engine = {}));
})(Serpent || (Serpent = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../../Point.ts" />
/// <reference path="../../Size.ts" />
/// <reference path="../Stage.ts" />
/// <reference path="./Shape.ts" />
var Serpent;
(function (Serpent) {
    var Broadway;
    (function (Broadway) {
        var Actor;
        (function (Actor) {
            var Character = (function (_super) {
                __extends(Character, _super);
                function Character(stage) {
                    _super.call(this, stage);
                }
                Character.prototype.updateContent = function () {
                    if (this.script) {
                        while (!this.script()) {
                            continue;
                        }
                    }
                };
                return Character;
            })(Actor.Shape);
            Actor.Character = Character;
        })(Actor = Broadway.Actor || (Broadway.Actor = {}));
    })(Broadway = Serpent.Broadway || (Serpent.Broadway = {}));
})(Serpent || (Serpent = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../../Point.ts" />
/// <reference path="../../Size.ts" />
/// <reference path="../Stage.ts" />
/// <reference path="./Character.ts" />
/// <reference path="../../Direction.ts" />
var Serpent;
(function (Serpent) {
    var Broadway;
    (function (Broadway) {
        var Actor;
        (function (Actor) {
            var Protagonist = (function (_super) {
                __extends(Protagonist, _super);
                function Protagonist(stage, direction) {
                    _super.call(this, stage);
                    this.direction = direction;
                    this.directionQueue = [];
                }
                Protagonist.prototype.script = function () {
                    this.move();
                    if (this.directionQueue.length > 0 && this.directionQueue[0] != this.direction) {
                        this.changeDirection();
                    }
                    else {
                        this.directionQueue.shift();
                    }
                    return true;
                };
                Protagonist.prototype.queueDirection = function (requestedDirection) {
                    if (this.stage.animation.isResumed()) {
                        this.directionQueue.push(requestedDirection);
                    }
                };
                Protagonist.prototype.changeDirection = function () {
                    this.direction = this.directionQueue.shift();
                };
                return Protagonist;
            })(Actor.Character);
            Actor.Protagonist = Protagonist;
        })(Actor = Broadway.Actor || (Broadway.Actor = {}));
    })(Broadway = Serpent.Broadway || (Serpent.Broadway = {}));
})(Serpent || (Serpent = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="./Tileset.ts" />
/// <reference path="./TileShape.ts" />
/// <reference path="../Broadway/Actor/Protagonist.ts" />
/// <reference path="../Direction.ts" />
var Serpent;
(function (Serpent) {
    var Engine;
    (function (Engine) {
        var Player = (function (_super) {
            __extends(Player, _super);
            function Player(tileset, direction) {
                _super.call(this, tileset, direction);
            }
            return Player;
        })(Serpent.Broadway.Actor.Protagonist);
        Engine.Player = Player;
    })(Engine = Serpent.Engine || (Serpent.Engine = {}));
})(Serpent || (Serpent = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../Player.ts" />
/// <reference path="../Pixel.ts" />
/// <reference path="../../Direction.ts" />
/// <reference path="../../Helper/Extension.ts" />
/// <reference path="./Board.ts" />
var Serpent;
(function (Serpent) {
    var Engine;
    (function (Engine) {
        var Game;
        (function (Game) {
            var Snake = (function (_super) {
                __extends(Snake, _super);
                function Snake(board) {
                    _super.call(this, board, Serpent.Direction.Right);
                    this.board = board;
                    this.pixels = [];
                    this.directions = [undefined, undefined, undefined];
                    this.pixels.push(new Engine.Pixel(board), new Engine.Pixel(board), new Engine.Pixel(board));
                    this.lastPosition = Serpent.Point.default();
                }
                Snake.prototype.move = function () {
                    this.directions.pop();
                    this.directions.unshift(this.direction);
                };
                Snake.prototype.script = function () {
                    var _this = this;
                    _super.prototype.script.call(this);
                    this.lastPosition.moveToPoint(Serpent.Helper.Extension.last(this.pixels).position);
                    this.pixels.forEach(function (p, i) {
                        _this.slither(p, _this.directions[i]);
                        if (_this.hasColidedWithSelf() || _this.hasColidedWithBound()) {
                            _this.board.gameOver();
                        }
                    });
                    return true;
                };
                Snake.prototype.renderContent = function () {
                    this.pixels.forEach(function (p) { return p.render(); });
                };
                Snake.prototype.hasColidedWith = function (otherTileShape) {
                    return this.pixels.some(function (p) {
                        return p.hasCollidedWith(otherTileShape);
                    });
                };
                Snake.prototype.grow = function () {
                    var addition = new Engine.Pixel(this.board);
                    addition.position.moveToPoint(this.lastPosition);
                    this.pixels.push(addition);
                    this.directions.push(this.direction);
                };
                Snake.prototype.slither = function (pixel, direction) {
                    switch (direction) {
                        case Serpent.Direction.Down:
                            pixel.position.y += pixel.size.height;
                            break;
                        case Serpent.Direction.Up:
                            pixel.position.y -= pixel.size.height;
                            break;
                        case Serpent.Direction.Left:
                            pixel.position.x -= pixel.size.width;
                            break;
                        case Serpent.Direction.Right:
                            pixel.position.x += pixel.size.width;
                            break;
                    }
                };
                Snake.prototype.hasColidedWithSelf = function () {
                    var _this = this;
                    return this.tail().some(function (p, i) {
                        return p.hasCollidedWith(_this.pixels[0]) && _this.directions[i] != undefined;
                    });
                };
                Snake.prototype.hasColidedWithBound = function () {
                    return this.head().hasPassedAnyBound();
                };
                Snake.prototype.changeDirection = function () {
                    var request = this.directionQueue[0];
                    var changeIsVerical = request == Serpent.Direction.Up || request == Serpent.Direction.Down, thisIsVerical = this.direction == Serpent.Direction.Up || this.direction == Serpent.Direction.Down;
                    if ((changeIsVerical && !thisIsVerical) || (!changeIsVerical && thisIsVerical)) {
                        _super.prototype.changeDirection.call(this);
                    }
                    else {
                        this.directionQueue.shift();
                    }
                };
                Snake.prototype.head = function () {
                    return Serpent.Helper.Extension.first(this.pixels);
                };
                Snake.prototype.tail = function () {
                    return this.pixels.slice(1);
                };
                Snake.prototype.body = function () {
                    return this.pixels;
                };
                return Snake;
            })(Engine.Player);
            Game.Snake = Snake;
        })(Game = Engine.Game || (Engine.Game = {}));
    })(Engine = Serpent.Engine || (Serpent.Engine = {}));
})(Serpent || (Serpent = {}));

/// <reference path="../ITilesetConfig.ts" />
/// <reference path="./Snake.ts" />

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../Pixel.ts" />
/// <reference path="./Snake.ts" />
/// <reference path="./Board.ts" />
var Serpent;
(function (Serpent) {
    var Engine;
    (function (Engine) {
        var Game;
        (function (Game) {
            var Food = (function (_super) {
                __extends(Food, _super);
                function Food(board) {
                    _super.call(this, board);
                    this.board = board;
                    this.position = this.board.randomTilePosition();
                    this.moveRandom();
                }
                Food.prototype.updateContent = function () {
                    if (this.board.snake.hasColidedWith(this)) {
                        this.board.score++;
                        this.board.snake.grow();
                        this.moveRandom();
                    }
                };
                Food.prototype.moveRandom = function () {
                    this.position = this.tileset.randomTilePosition();
                };
                return Food;
            })(Engine.Pixel);
            Game.Food = Food;
        })(Game = Engine.Game || (Engine.Game = {}));
    })(Engine = Serpent.Engine || (Serpent.Engine = {}));
})(Serpent || (Serpent = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../Tileset.ts" />
/// <reference path="./IBoardConfig.ts" />
/// <reference path="./Snake.ts" />
/// <reference path="./Food.ts" />
var Serpent;
(function (Serpent) {
    var Engine;
    (function (Engine) {
        var Game;
        (function (Game) {
            var Board = (function (_super) {
                __extends(Board, _super);
                function Board(config) {
                    config.actors = function (stage) {
                        return [config.snake(stage), config.food(stage)];
                    };
                    _super.call(this, config);
                    this.onGameOver = config.onGameOver;
                    this.score = 0;
                    this.snake = this.actors[0];
                    this.food = this.actors[1];
                }
                Board.prototype.gameOver = function () {
                    if (this.animation.isResumed()) {
                        this.animation.suspend();
                        if (this.onGameOver) {
                            this.onGameOver(this);
                        }
                    }
                };
                Board.prototype.reset = function () {
                    this.score = 0;
                    this.actors[0] = new Game.Snake(this);
                    this.actors[1] = new Game.Food(this);
                    this.snake = this.actors[0];
                    this.food = this.actors[1];
                    this.clear();
                    this.actors.forEach(function (a) { return a.render(); });
                };
                return Board;
            })(Engine.Tileset);
            Game.Board = Board;
        })(Game = Engine.Game || (Engine.Game = {}));
    })(Engine = Serpent.Engine || (Serpent.Engine = {}));
})(Serpent || (Serpent = {}));
