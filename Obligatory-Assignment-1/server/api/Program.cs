using dataAccess;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using dataAccess.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<DMIContext>(opt => opt.UseInMemoryDatabase("Paper"));

builder.Services.AddOpenApiDocument(configure =>
{
    configure.Title = "Dunder Mifflin Infinity"; // Set your API title
    configure.Description = "Try and test"; // Set your API description
    configure.Version = "v1"; //test of my branch
});

builder.Services.AddCors();


var app = builder.Build();
app.UseOpenApi();
app.UseSwaggerUi();

app.MapControllers();

app.UseCors( opts => {

    opts.AllowAnyOrigin();

    opts.AllowAnyMethod();

    opts.AllowAnyHeader();

});


app.Run();
