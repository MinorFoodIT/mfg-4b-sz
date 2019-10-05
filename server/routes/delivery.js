var express = require('express');
var router = express.Router();
var moment = require('moment');
var {formatJSON , formatJSONWrap ,printText ,isUndefined ,isNull} = require('./../config/helper')
var {process,status} = require('./../config/status');
const httpStatus = require('http-status');
const APIError = require('../helper/APIError');

//Database initial connection
var mysqldb = require('./../mysql-client');

/* GET users listing. */
router.get('/healthcheck', function(req ,res, next){

    res.send(JSON.stringify({"status":"ok"}));
})

router.get('/v1/sites', function(req ,res, next){
    mysqldb((err,connection) => {
        connection.query('SELECT * FROM Sites ',function (error, results ,fields){
            if(error){
                res.send(JSON.stringify(error));
                throw error;
            }
            res.send(JSON.stringify(results));
        })
        connection.release();
    })

})

router.get('/v1/report_transaction/:startdate/:enddate/:site', function(req ,res, next){
    var startdate = req.params.startdate;
    startdate = startdate.substring(0,4)+'-'+startdate.substring(4,6)+'-'+startdate.substring(6,8);
    var enddate = req.params.enddate;
    enddate = enddate.substring(0,4)+'-'+enddate.substring(4,6)+'-'+enddate.substring(6,8);
    var site = req.params.site;
    console.group('Report of transaction :');
    console.log('Date : '+startdate +' to '+enddate);
    console.groupEnd();
    mysqldb((err,connection) => {
        connection.query('SELECT ord.id ,ord.storeID,st.siteName,case when cancelTime > 0 then 0 else 1 end as status \n' +
            ',ord.orderName,ord.tranDate,ord.cookingFinishTime,ord.pickupFinishTime \n' +
            ',TIMESTAMPDIFF(MINUTE, ord.tranDate, ord.cookingFinishTime) as cookingTime,TIMESTAMPDIFF(MINUTE, ord.cookingFinishTime, ord.pickupFinishTime) as pickupTime \n' +
            ',ord.grossTotal\n' +
            ' FROM storeasservice.orders ord inner join storeasservice.Sites st on ord.storeID = st.siteNumber\n' +
            ' where ((ord.cookingFinishTime > 0 and ord.pickupFinishTime > 0) or (ord.cancelTime)) \n' +
            ' and ord.tranDate between TIMESTAMP(\''+startdate+'\')  and TIMESTAMP(\''+enddate+'\') \n' +
            ' and ord.storeID = \''+site+'\' ',function (error, results ,fields){
            if(error){
                res.send(JSON.stringify(error));
                throw error;
            }
            res.send(JSON.stringify(results));
        })
        connection.release();
    })

})

router.get('/v1/report_monthly_transaction/:startdate/:enddate', function(req ,res, next){
    var startdate = req.params.startdate;
    startdate = startdate.substring(0,4)+'-'+startdate.substring(4,6)+'-'+startdate.substring(6,8);
    var enddate = req.params.enddate;
    enddate = enddate.substring(0,4)+'-'+enddate.substring(4,6)+'-'+enddate.substring(6,8);
    var site = req.params.site;

    console.group('Report of monthly transaction :');
    console.log('Date : '+startdate +' to '+enddate);
    console.groupEnd();
    mysqldb((err,connection) => {
        connection.query('SELECT st.siteName ,count(ord.id) as totalOrder ,sum(ord.grossTotal) as totalSale \n' +
            ',sum(TIMESTAMPDIFF(MINUTE, ord.tranDate, ord.cookingFinishTime))/count(ord.id) as avgCooking \n' +
            ',sum(TIMESTAMPDIFF(MINUTE, ord.cookingFinishTime, ord.pickupFinishTime))/count(ord.id) as avgPickup \n' +
            ',sum(case when TIMESTAMPDIFF(MINUTE, ord.tranDate, ord.cookingFinishTime) > 15 then 1 else 0 end) as aboveCooking \n' +
            ',(sum(case when TIMESTAMPDIFF(MINUTE, ord.tranDate, ord.cookingFinishTime) > 15 then 1 else 0 end)/count(ord.id))*100 as aboveCookingPercent \n' +
            ' FROM storeasservice.orders ord inner join storeasservice.Sites st on ord.storeID = st.siteNumber\n' +
            ' where ((ord.cookingFinishTime > 0 and ord.pickupFinishTime > 0) or (ord.cancelTime)) \n' +
            ' and ord.tranDate between TIMESTAMP(\''+startdate+'\')  and TIMESTAMP(\''+enddate+'\') \n' +
            '  ',function (error, results ,fields){
            if(error){
                res.send(JSON.stringify(error));
                throw error;
            }
            res.send(JSON.stringify(results));
        })
        connection.release();
    })

})

router.post('/v1/login', function(req, res, next) {
    var username = req.body.username
    var password = req.body.password
    //console.log('Request incomming ');
    //console.log('login with '+username);
    mysqldb((err,connection) => {
        if(err){
            console.error('mysqldb :'+err);
        }
        //console.log(connection);
        connection.query('SELECT * from users where username = ? and password = ? and active=1', [username,password], function (error, results, fields) {
            if(error) throw error;
            res.send(JSON.stringify(results));
        });
        connection.release();
    });
});

//post
router.post('/v1/store/order/1112delivery/:brand',function(req, res ,next) {

    try{
        console.log("Incoming request from store");
        var jsonrequest = req.body;
        var site = req.params.brand.toUpperCase();
        //console.log('Request incomming ');
        console.log(jsonrequest);
        if(jsonrequest.hasOwnProperty('SDM')) {
            var orderStatus = jsonrequest.SDM.Status;
            var orderType = jsonrequest.SDM.OrderType;
            var addressID = jsonrequest.SDM.AddressID;
            var areaID = jsonrequest.SDM.AreaID;
            var storeID = jsonrequest.SDM.StoreID;
            var storeName = jsonrequest.SDM.StoreName;
            var storeNumber = jsonrequest.SDM.StoreNumber;
            var orderMode = jsonrequest.SDM.OrderMode;
            var orderName = jsonrequest.SDM.OrderName;

            //Date value in MS access file
            console.log(jsonrequest.SDM.DateOfTrans);
            var tranDate =  moment(jsonrequest.SDM.DateOfTrans, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm:ss'); //moment(!isUndefined(jsonrequest.SDM.DateOfTrans)?jsonrequest.SDM.DateOfTrans:'undefined','YYYYY-MM-DDTHH:mm:ss'); //"DateOfTrans": "0001-01-01T00:00:00",
            var dueDate  = moment(jsonrequest.SDM.DueTime, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm:ss'); //moment(!isUndefined(jsonrequest.SDM.DueTime)?jsonrequest.SDM.DueTime:'undefined','YYYY-MM-DDTHH:mm:ss');
            console.log(tranDate);
            console.log(dueDate);

            var customerID = jsonrequest.SDM.CustomerID;
            var grossTotal = jsonrequest.SDM.GrossTotal;
            var discountTotal = jsonrequest.SDM.DiscountTotal;
            var transactionBy = jsonrequest.SDM.CreateBy;
            var refID = jsonrequest.SDM.RefID;  //CHECKID

            var Note = jsonrequest.Note; //CHECKNO //80001
            var entries = JSON.stringify(jsonrequest.SDM.EntiresJson);

            mysqldb( (err,connection) => {
                connection.query('SELECT COUNT(*) AS count FROM orders Where orderName = ? and storeID = ? ',[orderName,storeID] ,function (error, results, fields){
                    if(error){
                        console.log("Database [orders select ordername] error ,"+error);
                    }
                    var orderExisting = results[0].count;
                    if(orderExisting == 0){
                        console.log("data preparation for inserting into database");
                        mysqldb((err,connection) => {
                            connection.query('INSERT INTO orders SET ? ',{
                                orderType: orderType,
                                addressID: addressID,
                                areaID: areaID,
                                storeID: storeID,
                                storeName: storeName,
                                storeNumber: storeNumber,
                                orderMode: orderMode,
                                orderName: orderName,
                                orderType: orderType,
                                tranDate: tranDate,
                                dueDate: dueDate,
                                customerID: customerID,
                                grossTotal: grossTotal,
                                discountTotal: discountTotal,
                                refID: refID,
                                transactionBy: transactionBy,
                                json: JSON.stringify(jsonrequest),
                                site: site,
                                status: orderStatus,
                                entries: entries
                            },function (error, results, fields) {
                                if(error){
                                    //const err = new APIError('Insert orders error', httpStatus.INTERNAL_SERVER_ERROR ,true);
                                    //next(err);
                                    //throw error;
                                    console.log("Database [orders insert] error ,"+error);
                                }else{
                                    //insert status
                                    /*
                                    * OkPacket {
                                                  fieldCount: 0,
                                                  affectedRows: 1,
                                                  insertId: 5,
                                                  serverStatus: 2,
                                                  warningCount: 0,
                                                  message: '',
                                                  protocol41: true,
                                                  changedRows: 0 }

                                    */

                                    connection.query('INSERT INTO orders_status SET ? ',{
                                        orderID: results.insertId,
                                        processID: process.order_cooking,
                                        statusID: status.cooking
                                    },function (error,results,fields) {
                                        if(error) {
                                            //throw error;
                                            //const err = new APIError('Insert orders error', httpStatus.INTERNAL_SERVER_ERROR ,true);
                                            //next(err);
                                            console.log("Database [orders_status Insert] error ,"+error);
                                        }
                                    })

                                }
                            })
                        });
                    }
                });
                connection.release();
            })
        }else{
            const err = new APIError('Invalid data', httpStatus.BAD_REQUEST ,true);
            next(err);
        }

    }catch(error){
        console.log('order incoming controller error '+error)
        const err = new APIError('Invalid data', httpStatus.BAD_REQUEST ,true);
        next(err);
    }

    res.send(JSON.stringify({status: "ok"}));

})

//put
router.put('/v1/store/order/1112delivery/statusupdate',function(req, res ,next) {
    try {
        var jsonrequest = req.body;
        console.log('Request update incomming ');
        console.log(jsonrequest);

        if (jsonrequest.hasOwnProperty('SDM')) {
            var orderId = jsonrequest.OrderId;
            var checkId = jsonrequest.CheckId;
            var status = jsonrequest.Status;

            mysqldb((err, connection) => {
                connection.query('UPDATE orders SET status = ? WHERE orderName = ? and refID = ? ', [status, orderId, checkId], function (error, results, fields) {
                    if (error) {
                        console.log("Database [orders status update] error ," + error);
                    }

                })
                connection.release();
            })
        }
    } catch(error) {
        console.log('order statusupdate error ' + error)
        const err = new APIError('Invalid data', httpStatus.BAD_REQUEST, true);
        next(err);
    }

    res.send(JSON.stringify({status: "ok"}));
})

//Get
router.get('/v1/store/orders/1112delivery/:brand/:store',function(req, res ,next) {
    var brand = req.params.brand.toUpperCase();
    var store = req.params.store.toUpperCase();

    mysqldb((err,connection) => {
        connection.query('SELECT * FROM orders WHERE site= ? and storeID= ? order by createdDate',[brand,store],function (error, results ,fields){
            if(error){
                res.send(JSON.stringify(error));
                throw error;
            }
            res.send(JSON.stringify(results));
        })
        connection.release();
    })

})

router.put('/v1/store/order/1112delivery/:id/cooking',function (req, res, next) {
    try {
        var jsonrequest = req.body;
        var id = req.params.id;
        var orderId =jsonrequest.orderName;
        console.log('Request update incomming ');
        console.log(jsonrequest);

        mysqldb((err, connection) => {
            connection.query('UPDATE orders SET cookingFinishTime = CURRENT_TIMESTAMP() WHERE id = ? ', [id], async function (error, results, fields) {
                if (error) {
                    console.log("Database [orders "+orderId+" cookingFinishTime update] error ," + error);
                }
                if(results.changedRows > 0) {
                    console.log("Database [orders " + orderId + " cookingFinishTime update] completed");

                    await connection.query('INSERT INTO orders_status SET ? ',{
                        orderID: id,
                        processID: process.order_ready_pickup,
                        statusID: status.readyToPickup
                    },function (error,results,fields) {
                        if(error) {
                            console.log("Database [orders_status Insert] readyToPickup error ,"+error);
                        }
                    })
                }
                res.send(JSON.stringify({status: "updated", id: id}));
            });
            connection.release();
        })
    }catch(error){
        const err = new APIError('Change cooking status error', httpStatus.INTERNAL_SERVER_ERROR ,true);
        next(err);
    }

});


router.put('/v1/store/order/1112delivery/:id/pickedup',function (req, res, next) {
    try {
        var jsonrequest = req.body;
        var id = req.params.id;
        var orderId =jsonrequest.orderName;
        console.log('Request update incomming ');
        console.log(jsonrequest);

        mysqldb((err, connection) => {
            connection.query('UPDATE orders SET pickupFinishTime = CURRENT_TIMESTAMP() WHERE id = ? ', [id], async function (error, results, fields) {
                if (error) {
                    console.log("Database [orders "+orderId+" pickupFinishTime update] error ," + error);
                }
                if(results.changedRows > 0) {
                    console.log("Database [orders " + orderId + " pickupFinishTime update] completed");
                    await connection.query('INSERT INTO orders_status SET ? ',{
                        orderID: id,
                        processID: process.order_pickup,
                        statusID: status.delivering
                    },function (error,results,fields) {
                        if(error) {
                            console.log("Database [orders_status Insert] pickedup error ,"+error);
                        }
                    })
                    res.send(JSON.stringify({status: "updated", id: id}));
                }
            });
            connection.release();
        })
    }catch(error){
        const err = new APIError('Change pickedup status error', httpStatus.INTERNAL_SERVER_ERROR ,true);
        next(err);
    }
});

router.put('/v1/store/order/1112delivery/:id/cancel',function (req, res, next) {
    try {
        var jsonrequest = req.body;
        var id = req.params.id;
        var orderId =jsonrequest.orderName;
        console.log('Request update incomming ');
        console.log(jsonrequest);

        mysqldb((err, connection) => {
            connection.query('UPDATE orders SET cancelTime = CURRENT_TIMESTAMP() WHERE id = ? ', [id],async function (error, results, fields) {
                if (error) {
                    console.log("Database [orders "+orderId+" cancelTime update] error ," + error);
                }
                if(results.changedRows > 0) {
                    console.log("Database [orders " + orderId + " cancelTime update] completed");
                    await connection.query('INSERT INTO orders_status SET ? ',{
                        orderID: id,
                        processID: process.order_cancel,
                        statusID: status.cancelled
                    },function (error,results,fields) {
                        if(error) {
                            console.log("Database [orders_status Insert] cancel error ,"+error);
                        }
                    })
                    res.send(JSON.stringify({status: "updated", id: id}));
                }
            });
            connection.release();
        })
    }catch(error){
        const err = new APIError('Change cancel status error', httpStatus.INTERNAL_SERVER_ERROR ,true);
        next(err);
    }
});


//Request from delivery channel (optional)
router.post('/v1/1112delivery/:brand', function(req, res, next) {
    try{
        console.log("In request post");
        var jsonrequest = req.body;
        var site = req.params.brand.toUpperCase();
        console.log('Request incomming ');
        console.log(jsonrequest);
        if(jsonrequest.hasOwnProperty('SDM')) {
            var orderType = jsonrequest.SDM.OrderType;
            var addressID = jsonrequest.SDM.AddressID;
            var areaID = jsonrequest.SDM.AreaID;
            var storeID = jsonrequest.SDM.StoreID;
            var storeName = jsonrequest.SDM.StoreName;
            var storeNumber = jsonrequest.SDM.StoreNumber;
            var orderMode = jsonrequest.SDM.OrderMode;
            var orderName = jsonrequest.SDM.OrderName;
            var orderType = jsonrequest.SDM.OrderType;

            var tempDate = moment('1990-01-01T00:00:00', 'YYYY-MM-DDTHH:mm:ss');
            var tranDate =  moment(jsonrequest.SDM.DateOfTrans, 'YYYY-MM-DDTHH:mm:ss'); //moment(!isUndefined(jsonrequest.SDM.DateOfTrans)?jsonrequest.SDM.DateOfTrans:'undefined','YYYYY-MM-DDTHH:mm:ss'); //"DateOfTrans": "0001-01-01T00:00:00",
            var dueDate  = moment(jsonrequest.SDM.DueTime, 'YYYY-MM-DDTHH:mm:ss'); //moment(!isUndefined(jsonrequest.SDM.DueTime)?jsonrequest.SDM.DueTime:'undefined','YYYY-MM-DDTHH:mm:ss');
            //console.log(moment(jsonrequest.SDM.DateOfTrans, 'YYYY-MM-DDTHH:mm:ss').toObject() );
            //console.log(tranDate.getFullYear() );
            //console.log(tranDate.getMonth() );
            //console.log(tranDate.getDay() );


            if(tranDate.diff(tempDate, 'days') < 0){
                tranDate = moment('1990-01-01T00:00:00', 'YYYY-MM-DDTHH:mm:ss').toDate();
            }
            if(dueDate.diff(tempDate, 'days') < 0){
                dueDate = moment('1990-01-01T00:00:00', 'YYYY-MM-DDTHH:mm:ss').toDate();
            }


            var customerID = jsonrequest.SDM.CustomerID;
            var grossTotal = jsonrequest.SDM.GrossTotal;
            var discountTotal = jsonrequest.SDM.DiscountTotal;

            var refID = "";
            var Note = !isUndefined(jsonrequest.Note)?jsonrequest.Note:'undefined';
            if(!isUndefined(Note)){
                var word = 'TPC Order:';
                orderId = Note.substring(Note.indexOf(word)+word.length).trim();
                var netOrder = orderId.split(/[ ]+/);
                if(netOrder.length > 2){
                    orderId = netOrder[0];
                }
                refID = orderId;
            }
            var transactionBy = jsonrequest.SDM.CreateBy;

            console.log("data preparation for inserting into database");
            mysqldb((err,connection) => {
                connection.query('INSERT INTO orders SET ? ',{
                    orderType: orderType,
                    addressID: addressID,
                    areaID: areaID,
                    storeID: storeID,
                    storeName: storeName,
                    storeNumber: storeNumber,
                    orderMode: orderMode,
                    orderName: orderName,
                    orderType: orderType,
                    tranDate: tranDate,
                    dueDate: dueDate,
                    customerID: customerID,
                    grossTotal: grossTotal,
                    discountTotal: discountTotal,
                    refID: refID,
                    transactionBy: transactionBy,
                    json: JSON.stringify(jsonrequest),
                    site: site
                },function (error, results, fields) {
                    if(error){
                        //const err = new APIError('Insert orders error', httpStatus.INTERNAL_SERVER_ERROR ,true);
                        //next(err);
                        //throw error;
                        console.log("Database [orders insert] error ,"+error);
                    }else{
                        //insert status
                        /*
                        * OkPacket {
                                      fieldCount: 0,
                                      affectedRows: 1,
                                      insertId: 5,
                                      serverStatus: 2,
                                      warningCount: 0,
                                      message: '',
                                      protocol41: true,
                                      changedRows: 0 }

                        */

                        connection.query('INSERT INTO orders_status SET ? ',{
                            orderID: results.insertId,
                            processID: process.order_in_store,
                            statusID: status.success
                        },function (error,results,fields) {
                            if(error) {
                                //throw error;
                                //const err = new APIError('Insert orders error', httpStatus.INTERNAL_SERVER_ERROR ,true);
                                //next(err);
                                console.log("Database [orders_status Insert] error ,"+error);
                            }
                        })

                    }
                })
            });

        }else{
            const err = new APIError('Invalid data', httpStatus.BAD_REQUEST ,true);
            next(err);
        }

    }catch(error){
        console.log('order delivered controller error '+error)
        const err = new APIError('Invalid data', httpStatus.BAD_REQUEST ,true);
        next(err);
    }

    res.send(JSON.stringify({status: "ok"}));
});


module.exports = router;