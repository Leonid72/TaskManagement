using System.Reflection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace TaskManagementServer.Api.Endpoints;

public static class EndpointExtensions
{
    public static IServiceCollection AddEndpoints(this IServiceCollection services)
    {
        services.AddEndpoints(Assembly.GetExecutingAssembly());
        return services;
    }
    //AddEndpoints - Registration via Reflection
    public static IServiceCollection AddEndpoints(this IServiceCollection services, Assembly assembly) 
    {
        ServiceDescriptor[] serviceDescriptors = assembly
            .DefinedTypes
            .Where(type => type is { IsAbstract: false, IsInterface: false } &&
                           type.IsAssignableTo(typeof(IEndpoint)))  //implements IEndpoint
            .Select(type => ServiceDescriptor.Transient(typeof(IEndpoint), type)) //We register each such class in DI
            .ToArray();

        services.TryAddEnumerable(serviceDescriptors); //You can register MANY IEndpoints
        return services;
    }

    //MapEndpoints — connecting to a pipeline Program.cs
    public static IApplicationBuilder MapEndpoints(this WebApplication app, RouteGroupBuilder? routeGroupBuilder = null)
    {
        IEnumerable<IEndpoint> endpoints = app.Services.GetRequiredService<IEnumerable<IEndpoint>>(); //We get ALL endpoints from DI
        IEndpointRouteBuilder builder = routeGroupBuilder is null ? app : routeGroupBuilder;

        foreach (IEndpoint endpoint in endpoints)
        {
            endpoint.MapEndpoint(builder);
        }

        return app;
    }
}
