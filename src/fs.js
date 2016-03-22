import globby from 'globby';

export default path => globby('**/*.js', { cwd: path });
