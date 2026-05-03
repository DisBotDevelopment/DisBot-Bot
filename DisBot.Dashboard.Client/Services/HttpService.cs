using System.Net.Http.Json;
using Microsoft.AspNetCore.Components.WebAssembly.Http;

namespace DisBot.Dashboard.Client.Services;

public class HttpService
{
    private readonly HttpClient HttpClient;

    public HttpService(HttpClient httpClient)
    {
        HttpClient = httpClient;
    }

    public async Task<T> Fetch<T>(HttpMethod method, string path)
        where T : class
    {
        var request = new HttpRequestMessage(method, path);
        request.SetBrowserRequestCredentials(BrowserRequestCredentials.Include);
        var response = await HttpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<T>() ?? throw new Exception($"Failed to fetch {path}");
    }
}