import * as action from '../src/index';
import * as core from '@actions/core';
import * as nock from 'nock';
import {Manifest, GitHub} from 'release-please';

const DEFAULT_INPUTS: Record<string, string> = {
  token: 'fake-token',
};

const fixturePrs = [
  {
    headBranchName: 'release-please--branches--main',
    baseBranchName: 'main',
    number: 22,
    title: 'chore(master): release 1.0.0',
    body: ':robot: I have created a release *beep* *boop*',
    labels: ['autorelease: pending'],
    files: [],
  },
  {
    headBranchName: 'release-please--branches--main',
    baseBranchName: 'main',
    number: 23,
    title: 'chore(master): release 1.0.0',
    body: ':robot: I have created a release *beep* *boop*',
    labels: ['autorelease: pending'],
    files: [],
  },
];

process.env.GITHUB_REPOSITORY = 'fakeOwner/fakeRepo';

function mockInputs(inputs: Record<string, string>): void {
  const allInputs = {...DEFAULT_INPUTS, ...inputs};
  jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
    return allInputs[name] || '';
  });
  jest.spyOn(core, 'getBooleanInput').mockImplementation((name: string) => {
    const value = allInputs[name] || '';
    return value.toLowerCase() === 'true';
  });
}

nock.disableNetConnect();

describe('release-please-action', () => {
  let output: Record<string, string | boolean> = {};

  beforeEach(() => {
    output = {};
    jest.spyOn(core, 'setOutput').mockImplementation(
      (key: string, value: string | boolean) => {
        output[key] = value;
      }
    );
    // Default branch lookup:
    nock('https://api.github.com').get('/repos/fakeOwner/fakeRepo').reply(200, {
      default_branch: 'main',
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('configuration', () => {
    let fakeManifest: any;
    describe('with release-type', () => {
      let fromConfigStub: jest.SpyInstance;
      beforeEach(() => {
        fakeManifest = {
          createReleases: jest.fn(),
          createPullRequests: jest.fn()
        } as any;
        fromConfigStub = jest.spyOn(Manifest, 'fromConfig')
          .mockResolvedValue(fakeManifest);
      });

      it('builds a manifest from config', async () => {
        mockInputs({
          'release-type': 'simple',
        });
        fakeManifest.createReleases.mockResolvedValue([]);
        fakeManifest.createPullRequests.mockResolvedValue([]);
        await action.main();
        expect(fakeManifest.createReleases).toHaveBeenCalledTimes(1);
        expect(fakeManifest.createPullRequests).toHaveBeenCalledTimes(1);
      });

      it('skips creating releases if skip-github-release specified', async () => {
        mockInputs({
          'skip-github-release': 'true',
          'release-type': 'simple',
        });
        fakeManifest.createPullRequests.mockResolvedValue([]);
        await action.main();
        expect(fakeManifest.createReleases).not.toHaveBeenCalled();
        expect(fakeManifest.createPullRequests).toHaveBeenCalledTimes(1);
      });

      it('skips creating pull requests if skip-github-pull-request specified', async () => {
        mockInputs({
          'skip-github-pull-request': 'true',
          'release-type': 'simple',
        });
        fakeManifest.createReleases.mockResolvedValue([]);
        await action.main();
        expect(fakeManifest.createReleases).toHaveBeenCalledTimes(1);
        expect(fakeManifest.createPullRequests).not.toHaveBeenCalled();
      });

      it('allows specifying custom target branch', async () => {
        mockInputs({
          'target-branch': 'dev',
          'release-type': 'simple',
        });
        fakeManifest.createReleases.mockResolvedValue([]);
        fakeManifest.createPullRequests.mockResolvedValue([]);
        await action.main();
        expect(fakeManifest.createReleases).toHaveBeenCalledTimes(1);
        expect(fakeManifest.createPullRequests).toHaveBeenCalledTimes(1);

        expect(fromConfigStub).toHaveBeenCalled();
      });

      it('allows specifying fork', async () => {
        mockInputs({
          'fork': 'true',
          'release-type': 'simple',
        });
        fakeManifest.createReleases.mockResolvedValue([]);
        fakeManifest.createPullRequests.mockResolvedValue([]);
        await action.main();
        expect(fakeManifest.createReleases).toHaveBeenCalledTimes(1);
        expect(fakeManifest.createPullRequests).toHaveBeenCalledTimes(1);

        expect(fromConfigStub).toHaveBeenCalled();
      });

      it('allows specifying bootstrap-sha', async () => {
        mockInputs({
          'bootstrap-sha': 'abc123def',
          'release-type': 'simple',
        });
        fakeManifest.createReleases.mockResolvedValue([]);
        fakeManifest.createPullRequests.mockResolvedValue([]);
        await action.main();
        expect(fakeManifest.createReleases).toHaveBeenCalledTimes(1);
        expect(fakeManifest.createPullRequests).toHaveBeenCalledTimes(1);

        expect(fromConfigStub).toHaveBeenCalled();
      });
    });

    describe('with manifest', () => {
      let fromManifestStub: jest.SpyInstance;
      beforeEach(() => {
        fakeManifest = {
          createReleases: jest.fn(),
          createPullRequests: jest.fn()
        } as any;
        fromManifestStub = jest.spyOn(Manifest, 'fromManifest')
          .mockResolvedValue(fakeManifest);
      });

      it('loads a manifest from the repository', async () => {
        mockInputs({});
        fakeManifest.createReleases.mockResolvedValue([]);
        fakeManifest.createPullRequests.mockResolvedValue([]);
        await action.main();
        expect(fakeManifest.createReleases).toHaveBeenCalledTimes(1);
        expect(fakeManifest.createPullRequests).toHaveBeenCalledTimes(1);
      });

      it('skips creating releases if skip-github-release specified', async () => {
        mockInputs({
          'skip-github-release': 'true',
        });
        fakeManifest.createPullRequests.mockResolvedValue([]);
        await action.main();
        expect(fakeManifest.createReleases).not.toHaveBeenCalled();
        expect(fakeManifest.createPullRequests).toHaveBeenCalledTimes(1);
      });

      it('skips creating pull requests if skip-github-pull-request specified', async () => {
        mockInputs({
          'skip-github-pull-request': 'true',
        });
        fakeManifest.createReleases.mockResolvedValue([]);
        await action.main();
        expect(fakeManifest.createReleases).toHaveBeenCalledTimes(1);
        expect(fakeManifest.createPullRequests).not.toHaveBeenCalled();
      });

      it('allows specifying custom target branch', async () => {
        mockInputs({
          'target-branch': 'dev',
        });
        fakeManifest.createReleases.mockResolvedValue([]);
        fakeManifest.createPullRequests.mockResolvedValue([]);
        await action.main();
        expect(fakeManifest.createReleases).toHaveBeenCalledTimes(1);
        expect(fakeManifest.createPullRequests).toHaveBeenCalledTimes(1);

        expect(fromManifestStub).toHaveBeenCalled();
      });

      it('allows specifying fork', async () => {
        mockInputs({
          'fork': 'true',
        });
        fakeManifest.createReleases.mockResolvedValue([]);
        fakeManifest.createPullRequests.mockResolvedValue([]);
        await action.main();
        expect(fakeManifest.createReleases).toHaveBeenCalledTimes(1);
        expect(fakeManifest.createPullRequests).toHaveBeenCalledTimes(1);

        expect(fromManifestStub).toHaveBeenCalled();
      });

      it('allows specifying bootstrap-sha', async () => {
        mockInputs({
          'bootstrap-sha': 'abc123def',
        });
        fakeManifest.createReleases.mockResolvedValue([]);
        fakeManifest.createPullRequests.mockResolvedValue([]);
        await action.main();
        expect(fakeManifest.createReleases).toHaveBeenCalledTimes(1);
        expect(fakeManifest.createPullRequests).toHaveBeenCalledTimes(1);

        expect(fromManifestStub).toHaveBeenCalled();
      });

      it('correctly filters undefined values in manifest overrides', async () => {
        mockInputs({
          'skip-labeling': 'true',
        });
        fakeManifest.createReleases.mockResolvedValue([]);
        fakeManifest.createPullRequests.mockResolvedValue([]);
        await action.main();
        expect(fakeManifest.createReleases).toHaveBeenCalledTimes(1);
        expect(fakeManifest.createPullRequests).toHaveBeenCalledTimes(1);

        expect(fromManifestStub).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(String),
          expect.any(String),
          expect.any(String),
          expect.objectContaining({
            skipLabeling: true,
          })
        );
      });

      it('includes bootstrap-sha in manifest overrides when provided', async () => {
        mockInputs({
          'bootstrap-sha': 'abc123def',
          'fork': 'true',
        });
        fakeManifest.createReleases.mockResolvedValue([]);
        fakeManifest.createPullRequests.mockResolvedValue([]);
        await action.main();
        expect(fakeManifest.createReleases).toHaveBeenCalledTimes(1);
        expect(fakeManifest.createPullRequests).toHaveBeenCalledTimes(1);

        expect(fromManifestStub).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(String),
          expect.any(String),
          expect.any(String),
          expect.objectContaining({
            fork: true,
            bootstrapSha: 'abc123def',
          })
        );
      });
    });

    describe('config-overrides-json', () => {
      let fromConfigStub: jest.SpyInstance;
      beforeEach(() => {
        const fakeManifest = {
          createReleases: jest.fn(),
          createPullRequests: jest.fn()
        } as any;
        fakeManifest.createReleases.mockResolvedValue([]);
        fakeManifest.createPullRequests.mockResolvedValue([]);
        fromConfigStub = jest.spyOn(Manifest, 'fromConfig')
          .mockResolvedValue(fakeManifest);
      });

      it('parses valid JSON config overrides', async () => {
        mockInputs({
          'release-type': 'simple',
          'config-overrides-json': '{"release-type": "node", "bump-minor-pre-major": true}'
        });
        await action.main();
        const calls = fromConfigStub.mock.calls;
        expect(calls[0][2]).toEqual(expect.objectContaining({
          releaseType: 'simple',
          bumpMinorPreMajor: true,
        }));
      });

      it('handles empty config overrides', async () => {
        mockInputs({
          'release-type': 'simple',
          'config-overrides-json': '{}'
        });
        await action.main();
        const calls = fromConfigStub.mock.calls;
        expect(calls[0][2]).toEqual(expect.objectContaining({
          releaseType: 'simple',
        }));
      });

      it('defaults to empty object when config-overrides-json not provided', async () => {
        mockInputs({
          'release-type': 'simple'
        });
        await action.main();
        const calls = fromConfigStub.mock.calls;
        expect(calls[0][2]).toEqual(expect.objectContaining({
          releaseType: 'simple',
        }));
      });

      it('throws error for invalid JSON', async () => {
        mockInputs({
          'release-type': 'simple',
          'config-overrides-json': '{invalid json'
        });
        await expect(action.main()).rejects.toThrow('Could not parse config override:');
      });

      it('input parameters override config overrides', async () => {
        mockInputs({
          'release-type': 'simple',
          'include-component-in-tag': 'true',
          'config-overrides-json': '{"release-type": "node", "include-component-in-tag": false}'
        });
        await action.main();
        const calls = fromConfigStub.mock.calls;
        expect(calls[0][2]).toEqual(expect.objectContaining({
          releaseType: 'simple',
          includeComponentInTag: true,
        }));
      });

      it('extracts complex config overrides correctly', async () => {
        mockInputs({
          'release-type': 'simple',
          'config-overrides-json': JSON.stringify({
            'changelog-sections': [{ type: 'feat', section: 'Features' }],
            'extra-files': ['VERSION.txt'],
            'skip-github-release': true,
            'label': 'release: pending,autorelease: tagged'
          })
        });
        await action.main();
        const calls = fromConfigStub.mock.calls;
        expect(calls[0][2]).toEqual(expect.objectContaining({
          releaseType: 'simple',
          changelogSections: [{ type: 'feat', section: 'Features' }],
          extraFiles: ['VERSION.txt'],
          skipGithubRelease: true,
          labels: ['release: pending', 'autorelease: tagged'],
        }));
      });
    });

    it('allows specifying manifest config paths', async () => {
      mockInputs({
        'config-file': 'path/to/config.json',
        'manifest-file': 'path/to/manifest.json',
      });
      const fakeManifest = {
        createReleases: jest.fn(),
        createPullRequests: jest.fn()
      } as any;
      fakeManifest.createReleases.mockResolvedValue([]);
      fakeManifest.createPullRequests.mockResolvedValue([]);
      const fromManifestStub = jest.spyOn(Manifest, 'fromManifest')
        .mockResolvedValue(fakeManifest);
      await action.main();
      expect(fakeManifest.createReleases).toHaveBeenCalledTimes(1);
      expect(fakeManifest.createPullRequests).toHaveBeenCalledTimes(1);

      expect(fromManifestStub).toHaveBeenCalled();
    });

    it('allows specifying network options', async () => {
      mockInputs({
        'target-branch': 'dev',
        'proxy-server': 'some-host:9000',
        'github-api-url': 'https://my-enterprise-host.local/api',
        'github-graphql-url': 'https://my-enterprise-host.local/graphql',
      });
      const createGithubSpy = jest.spyOn(GitHub, 'create');
      const fakeManifest = {
        createReleases: jest.fn(),
        createPullRequests: jest.fn()
      } as any;
      fakeManifest.createReleases.mockResolvedValue([]);
      fakeManifest.createPullRequests.mockResolvedValue([]);
      jest.spyOn(Manifest, 'fromManifest').mockResolvedValue(fakeManifest);
      await action.main();
      expect(fakeManifest.createReleases).toHaveBeenCalledTimes(1);
      expect(fakeManifest.createPullRequests).toHaveBeenCalledTimes(1);

      expect(createGithubSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          apiUrl: 'https://my-enterprise-host.local/api',
          graphqlUrl: 'https://my-enterprise-host.local',
          proxy: {
            host: 'some-host',
            port: 9000,
          },
          defaultBranch: 'dev',
        })
      );
    });
  });

  describe('outputs', () => {
    it('sets appropriate outputs when GitHub release created', async () => {
      mockInputs({});
      const fakeManifest = {
        createReleases: jest.fn(),
        createPullRequests: jest.fn()
      } as any;
      fakeManifest.createReleases.mockResolvedValue([
        {
          id: 123456,
          name: 'v1.2.3',
          tagName: 'v1.2.3',
          sha: 'abc123',
          notes: 'Some release notes',
          url: 'http://example2.com',
          draft: false,
          uploadUrl: 'http://example.com',
          path: '.',
          version: '1.2.3',
          major: 1,
          minor: 2,
          patch: 3,
          prNumber: 234,
        },
      ]);
      fakeManifest.createPullRequests.mockResolvedValue([]);
      jest.spyOn(Manifest, 'fromManifest').mockResolvedValue(fakeManifest);
      await action.main();
      expect(fakeManifest.createReleases).toHaveBeenCalledTimes(1);
      expect(fakeManifest.createPullRequests).toHaveBeenCalledTimes(1);

      expect(output.id).toBe(123456);
      expect(output.release_created).toBe(true);
      expect(output.releases_created).toBe(true);
      expect(output.upload_url).toBe('http://example.com');
      expect(output.html_url).toBe('http://example2.com');
      expect(output.tag_name).toBe('v1.2.3');
      expect(output.major).toBe(1);
      expect(output.minor).toBe(2);
      expect(output.patch).toBe(3);
      expect(output.version).toBe('1.2.3');
      expect(output.sha).toBe('abc123');
      expect(output.paths_released).toBe('["."]');
    });

    it('sets appropriate outputs when release PR opened', async () => {
      mockInputs({});
      const fakeManifest = {
        createReleases: jest.fn(),
        createPullRequests: jest.fn()
      } as any;
      fakeManifest.createReleases.mockResolvedValue([]);
      fakeManifest.createPullRequests.mockResolvedValue([fixturePrs[0]]);
      jest.spyOn(Manifest, 'fromManifest').mockResolvedValue(fakeManifest);
      await action.main();
      expect(fakeManifest.createReleases).toHaveBeenCalledTimes(1);
      expect(fakeManifest.createPullRequests).toHaveBeenCalledTimes(1);

      const {pr, prs, prs_created} = output;
      expect(prs_created).toBe(true);
      expect(pr).toEqual(fixturePrs[0]);
      expect(prs).toEqual(JSON.stringify([fixturePrs[0]]));
    });

    it('sets appropriate output if multiple releases are created', async () => {
      mockInputs({});
      const fakeManifest = {
        createReleases: jest.fn(),
        createPullRequests: jest.fn()
      } as any;
      fakeManifest.createReleases.mockResolvedValue([
        {
          id: 123456,
          name: 'v1.0.0',
          tagName: 'v1.0.0',
          sha: 'abc123',
          notes: 'Some release notes',
          url: 'http://example2.com',
          draft: false,
          uploadUrl: 'http://example.com',
          path: 'a',
          version: '1.0.0',
          major: 1,
          minor: 0,
          patch: 0,
          prNumber: 234,
        },
        {
          id: 123,
          name: 'v1.2.0',
          tagName: 'v1.2.0',
          sha: 'abc123',
          notes: 'Some release notes',
          url: 'http://example2.com',
          draft: false,
          uploadUrl: 'http://example.com',
          path: 'b',
          version: '1.2.0',
          major: 1,
          minor: 2,
          patch: 0,
          prNumber: 235,
        },
      ]);
      fakeManifest.createPullRequests.mockResolvedValue([]);
      jest.spyOn(Manifest, 'fromManifest').mockResolvedValue(fakeManifest);
      await action.main();
      expect(fakeManifest.createReleases).toHaveBeenCalledTimes(1);

      expect(output['a--id']).toBe(123456);
      expect(output['a--release_created']).toBe(true);
      expect(output['a--upload_url']).toBe('http://example.com');
      expect(output['a--html_url']).toBe('http://example2.com');
      expect(output['a--tag_name']).toBe('v1.0.0');
      expect(output['a--major']).toBe(1);
      expect(output['a--minor']).toBe(0);
      expect(output['a--patch']).toBe(0);
      expect(output['a--version']).toBe('1.0.0');
      expect(output['a--sha']).toBe('abc123');
      expect(output['a--path']).toBe('a');

      expect(output['b--id']).toBe(123);
      expect(output['b--release_created']).toBe(true);
      expect(output['b--upload_url']).toBe('http://example.com');
      expect(output['b--html_url']).toBe('http://example2.com');
      expect(output['b--tag_name']).toBe('v1.2.0');
      expect(output['b--major']).toBe(1);
      expect(output['b--minor']).toBe(2);
      expect(output['b--patch']).toBe(0);
      expect(output['b--version']).toBe('1.2.0');
      expect(output['b--sha']).toBe('abc123');
      expect(output['b--path']).toBe('b');

      expect(output.paths_released).toBe('["a","b"]');
      expect(output.releases_created).toBe(true);
    });

    it('sets appropriate output if multiple release PR opened', async () => {
      mockInputs({});
      const fakeManifest = {
        createReleases: jest.fn(),
        createPullRequests: jest.fn()
      } as any;
      fakeManifest.createReleases.mockResolvedValue([]);
      fakeManifest.createPullRequests.mockResolvedValue(fixturePrs);
      jest.spyOn(Manifest, 'fromManifest').mockResolvedValue(fakeManifest);
      await action.main();
      expect(fakeManifest.createReleases).toHaveBeenCalledTimes(1);
      expect(fakeManifest.createPullRequests).toHaveBeenCalledTimes(1);

      const {pr, prs} = output;
      expect(pr).toEqual(fixturePrs[0]);
      expect(prs).toEqual(JSON.stringify(fixturePrs));
    });

    it('does not set outputs when no release created or PR returned', async () => {
      mockInputs({});
      const fakeManifest = {
        createReleases: jest.fn(),
        createPullRequests: jest.fn()
      } as any;
      fakeManifest.createReleases.mockResolvedValue([]);
      fakeManifest.createPullRequests.mockResolvedValue([]);
      jest.spyOn(Manifest, 'fromManifest').mockResolvedValue(fakeManifest);
      await action.main();
      expect(fakeManifest.createReleases).toHaveBeenCalledTimes(1);
      expect(fakeManifest.createPullRequests).toHaveBeenCalledTimes(1);

      expect(Object.hasOwnProperty.call(output, 'pr')).toBe(false);
      expect(output.paths_released).toBe('[]');
      expect(output.prs_created).toBe(false);
      expect(output.releases_created).toBe(false);
    });
  });
});
