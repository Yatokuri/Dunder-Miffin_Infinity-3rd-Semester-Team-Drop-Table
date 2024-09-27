﻿using dataAccess.Models;
using Microsoft.AspNetCore.Mvc;
using service;

namespace api.Controllers;

[ApiController]
public class MyOrdersController(MyOrderService service) : ControllerBase
{
    
    [HttpGet]
    [Route("api/order")]
    public ActionResult GetAllOrders(int customerId)
    {
        var orders = service.GetOrdersByCustomerIdAsync(customerId);
        return Ok(orders);
    }
    
    [HttpPost]
    [Route("api/order")]
    public ActionResult AddOrder([FromBody] Order order)
    {
        var newOrder = service.AddOrder(order);
        return Ok(newOrder);
    }
    
}