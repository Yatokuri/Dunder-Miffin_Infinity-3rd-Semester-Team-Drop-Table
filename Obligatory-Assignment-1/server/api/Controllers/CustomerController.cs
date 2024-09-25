﻿using Microsoft.AspNetCore.Mvc;
using dataAccess.Models;
using service;

namespace api.Controllers
{
    [ApiController]
    [Route("api/customer")]
    public class CustomerController : ControllerBase
    {
        private readonly CustomerService _service;

        public CustomerController(CustomerService service)
        {
            _service = service;
        }

        // Create Customer
        [HttpPost]
        public ActionResult<Customer> CreateCustomer([FromBody] Customer customer)
        {
            var newCustomer = _service.CreateCustomer(customer);
            return Ok(newCustomer);
        }

        // Get All Customers
        [HttpGet]
        public ActionResult<IEnumerable<Customer>> GetAllCustomers()
        {
            var customers = _service.GetAllCustomers();
            return Ok(customers);
        }

        // Get Customer by ID
        [HttpGet("{id}")]
        public ActionResult<Customer> GetCustomerById(int id)
        {
            var customer = _service.GetCustomerById(id);
            if (customer == null) return NotFound();
            return Ok(customer);
        }

        // Update Customer
        [HttpPut("{id}")]
        public ActionResult<Customer> UpdateCustomer(int id, [FromBody] Customer customer)
        {
            var updatedCustomer = _service.UpdateCustomer(id, customer);
            if (updatedCustomer == null) return NotFound();
            return Ok(updatedCustomer);
        }

        // Delete Customer
        [HttpDelete("{id}")]
        public ActionResult DeleteCustomer(int id)
        {
            var deleted = _service.DeleteCustomer(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}